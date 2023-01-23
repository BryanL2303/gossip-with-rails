module Api
	class CommunityController < ApplicationController
		protect_from_forgery with: :null_session

		def createCommunity
			user = authorised_user(params[:token])
			if user == nil
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			else
				community = Community.new(community_name: params[:community_name],
				 community_description: params[:community_description],
				 gossip_account_id: user.id,
				 upvote: 0, downvote: 0)
				community.save
				if params[:categories] != []
					begin
						category_tag = CategoryTag.new(category_id: params[:categories]['value'],
							community_id: community.id)
						category_tag.save
					rescue
						for category in params[:categories]
							category_tag = CategoryTag.new(category_id: category['value'],
						 	community_id: community.id)
							category_tag.save
						end					
					end
				end
				render json: CommunitySerializer.new(community).serialized_json
			end
		end

		def checkCommunityLimit
			if params[:category_id] != nil and params[:category_id] != ''
				communities = Community.belongs_to_category(params[:category_id])
			else
				communities = Community.all
			end

			render json: communities.length
		end

		def fetchCommunities
			if params[:category_id] != nil and params[:category_id] != ''
				communities = Community.belongs_to_category(params[:category_id]).order(params[:sort_by]).reverse_order().limit(params[:count]).offset(params[:offset])
			else
				communities = Community.all.order(params[:sort_by]).reverse_order().limit(params[:count]).offset(params[:offset])
			end

			render json: CommunitySerializer.new(communities).serialized_json
		end

		def fetchTopics
			topics = Topic.where(community_id: params[:id]).order(params[:sort_by]).limit(params[:count])

			render json: TopicSerializer.new(topics).serialized_json		
		end

		def editCommunity
			user = authorised_user(params[:token])
			if user != nil
				community = Community.find_by(id: params[:id])
				community.community_name = params[:community_name]
				community.community_description = params[:community_description]
				community.save

				category_tags = CategoryTag.where(community_id: params[:id])
				category_tags.destroy_all
				if params[:categories] != []
					begin
						category_tag = CategoryTag.new(category_id: params[:categories]['value'],
							community_id: community.id)
						category_tag.save
					rescue
						for category in params[:categories]
							category_tag = CategoryTag.new(category_id: category['value'],
							 community_id: community.id)
							category_tag.save
						end					
					end
				end
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def deleteCommunity
			user = authorised_user(params[:token])
			if user != nil
				topics = Topic.belongs_to_community(params[:id])
				for topic in topics
					comments = Comment.where(topic_id: topic.id)
					for comment in comments
						replies = Reply.where(comment_id: comment.id)
						replies.destroy_all
					end
					comments.destroy_all

					category_tags = TopicCategoryTag.where(topic_id: topic.id)
					category_tags.destroy_all
					community_tags = TopicCommunityTag.where(topic_id: topic.id)
					community_tags.destroy_all
					topic.destroy
				end

				category_tags = CategoryTag.where(community_id: params[:id])
				category_tags.destroy_all

				community = Community.find_by(id: params[:id])

				if community.destroy
					head :no_content
				else
					render json: {error: account.errors.messages}, status: 422
				end
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def show
			user = authorised_user(request.headers[:token])
			community = Community.find_by(id: params[:id])
			owner = GossipAccount.find_by(id: community.gossip_account_id)
			checkVote = CommunityVote.where(gossip_account_id: user.id,
					community_id: params[:id])[0]
			vote = nil
			if checkVote != nil
				vote =  checkVote.upvote
			end
			checkSave = PinnedCommunity.where(gossip_account_id: user.id,
					community_id: params[:id])[0]
			saved = nil
			if checkSave == nil
				saved = false
			else
				saved = true
			end

			render json: {data: CommunitySerializer.new(community), isOwner: user.id == community.gossip_account_id, ownerName: owner.account_name, vote: vote, saved: saved}
		end

		def upvoteCommunity
			user = authorised_user(params[:token])
			if user != nil
				communityVote = CommunityVote.where(gossip_account_id: user.id,
					community_id: params[:id])[0]
				community = Community.find_by(id: params[:id])
				if communityVote == nil
					community.upvote = community.upvote + 1
					newCommunityVote = CommunityVote.new(gossip_account_id: user.id,
						community_id: params[:id], upvote: true)
					newCommunityVote.save
				else
					if communityVote.upvote == true
						community.upvote = community.upvote - 1
						communityVote.destroy
					else
						communityVote.upvote = true
						communityVote.save
						community.upvote = community.upvote + 1
						community.downvote = community.downvote - 1
					end
				end
				community.save

				render json: {upvote: community.upvote, downvote: community.downvote}
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def downvoteCommunity
			user = authorised_user(params[:token])
			if user != nil
				communityVote = CommunityVote.where(gossip_account_id: user.id,
					community_id: params[:id])[0]
				community = Community.find_by(id: params[:id])
				if communityVote == nil
					community.downvote = community.downvote + 1
					newCommunityVote = CommunityVote.new(gossip_account_id: user.id,
						community_id: params[:id], upvote: false)
					newCommunityVote.save
				else
					if communityVote.upvote == false
						community.downvote = community.downvote - 1
						communityVote.destroy
					else
						communityVote.upvote = false
						communityVote.save
						community.upvote = community.upvote - 1
						community.downvote = community.downvote + 1
					end
				end
				community.save

				render json: {upvote: community.upvote, downvote: community.downvote}
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		private
		def options
			@options ||= { include: %i{topics}}
			@options ||= { include: %i{categories}}
		end
	end
end