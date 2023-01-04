module Api
	class CommunityController < ApplicationController
		protect_from_forgery with: :null_session

		def createCommunity
			community = Community.new(community_name: params[:community_name],
			 community_description: params[:community_description],
			 gossip_account_id: params[:gossip_account_id],
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

		def fetchCommunities
			if params[:category_id] != nil and params[:category_id] != ''
				communities = Community.belongs_to_category(params[:category_id]).order(params[:sort_by]).limit(params[:count])
			else
				communities = Community.all.order(params[:sort_by]).limit(params[:count])
			end

			render json: CommunitySerializer.new(communities).serialized_json
		end

		def createTopic
			topic = Topic.new(topic_name: params[:topic_name],
			 description: params[:description], gossip_account_id: params[:account_id],
			 active: true, community_id: params[:id], upvote: 0, downvote: 0)
			if topic.save
				render json: TopicSerializer.new(topic).serialized_json
			else
				render json: {error: topic.errors.messages}, status: 422
			end			
		end

		def fetchTopics
			topics = Topic.where(community_id: params[:id]).order(params[:sort_by]).limit(params[:count])

			render json: TopicSerializer.new(topics).serialized_json		
		end

		def editCommunity
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
		end

		def deleteCommunity
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
		end

		def show
			community = Community.find_by(id: params[:id])

			render json: CommunitySerializer.new(community).serialized_json
		end

		def upvoteCommunity
			communityVote = CommunityVote.where(gossip_account_id: params[:account_id],
				community_id: params[:id])[0]
			community = Community.find_by(id: params[:id])
			if communityVote == nil
				community.upvote = community.upvote + 1
				newCommunityVote = CommunityVote.new(gossip_account_id: params[:account_id],
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

			render json: CommunitySerializer.new(community).serialized_json
		end

		def downvoteCommunity
			communityVote = CommunityVote.where(gossip_account_id: params[:account_id],
				community_id: params[:id])[0]
			community = Community.find_by(id: params[:id])
			if communityVote == nil
				community.downvote = community.downvote + 1
				newCommunityVote = CommunityVote.new(gossip_account_id: params[:account_id],
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

			render json: CommunitySerializer.new(community).serialized_json
		end

		private
		def options
			@options ||= { include: %i{topics}}
			@options ||= { include: %i{categories}}
		end
		def community_param
			params.require(:community).permit(:gossip_account_id, :sort_by, :count)
		end
	end
end