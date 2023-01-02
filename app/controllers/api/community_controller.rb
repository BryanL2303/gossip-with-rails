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
					category_tag = TopicCategoryTag.new(category_id: params[:categories]['value'],
						topic_id: topic.id)
					category_tag.save
				rescue
					for category in params[:categories]
						category_tag = TopicCategoryTag.new(category_id: category['value'],
						 topic_id: topic.id)
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

		def destroy
			account = GossipAccount.find_by(id: params[:account_id])
			comments = Comment.where(topic_id: topic.id)
			comments.destroy_all
			#Loop through comments to destroy all replies
			topic = Topic.find_by(id: params[:topic_id])

			if topic.destroy
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