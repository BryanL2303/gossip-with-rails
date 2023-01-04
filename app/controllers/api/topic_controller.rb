module Api
	class TopicController < ApplicationController
		protect_from_forgery with: :null_session

		def createTopic
			topic = Topic.new(topic_name: params[:topic_name],
			 topic_description: params[:topic_description],
			  gossip_account_id: params[:account_id],
			 active: true, upvote: 0, downvote: 0)
			topic.save
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
			if params[:communities] != []
				community_tag = TopicCommunityTag.new(community_id: params[:communities]['value'],
				topic_id: topic.id)
				community_tag.save
			end
			render json: TopicSerializer.new(topic).serialized_json	
		end

		def fetchTopics
			if params[:category_id] != nil and params[:category_id] != ''
				topics = Topic.belongs_to_category(params[:category_id]).order(params[:sort_by]).limit(params[:count])
			else
				if params[:community_id] != nil and params[:community_id] != ''
					topics = Topic.belongs_to_community(params[:community_id]).order(params[:sort_by]).limit(params[:count])
				else
					topics = Topic.all.order(params[:sort_by]).limit(params[:count])
				end
			end

			render json: TopicSerializer.new(topics).serialized_json
		end

		def upvoteTopic
			topicVote = TopicVote.where(gossip_account_id: params[:account_id],
				topic_id: params[:id])[0]
			topic = Topic.find_by(id: params[:id])
			if topicVote == nil
				topic.upvote = topic.upvote + 1
				newTopicVote = TopicVote.new(gossip_account_id: params[:account_id],
					topic_id: params[:id], upvote: true)
				newTopicVote.save
			else
				if topicVote.upvote == true
					topic.upvote = topic.upvote - 1
					topicVote.destroy
				else
					topicVote.upvote = true
					topicVote.save
					topic.upvote = topic.upvote + 1
					topic.downvote = topic.downvote - 1
				end
			end

			if topic.save
				render json: TopicSerializer.new(topic).serialized_json
			else
				render json: {error: topic.errors.messages}, status: 422
			end	
		end

		def downvoteTopic
			topicVote = TopicVote.where(gossip_account_id: params[:account_id],
				topic_id: params[:id])[0]
			topic = Topic.find_by(id: params[:id])
			if topicVote == nil
				topic.downvote = topic.downvote + 1
				newTopicVote = TopicVote.new(gossip_account_id: params[:account_id],
					topic_id: params[:id], upvote: false)
				newTopicVote.save
			else
				if topicVote.upvote == false
					topic.downvote = topic.downvote - 1
					topicVote.destroy
				else
					topicVote.upvote = false
					topicVote.save
					topic.upvote = topic.upvote - 1
					topic.downvote = topic.downvote + 1
				end
			end

			if topic.save
				render json: TopicSerializer.new(topic).serialized_json
			else
				render json: {error: topic.errors.messages}, status: 422
			end
		end
		
		def editTopic
			topic = Topic.find_by(id: params[:id])
			topic.topic_name = params[:topic_name]
			topic.topic_description = params[:topic_description]
			topic.save

			category_tags = TopicCategoryTag.where(topic_id: params[:id])
			category_tags.destroy_all
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
		end

		def deleteTopic
			comments = Comment.where(topic_id: params[:id])
			for comment in comments
				replies = Reply.where(comment_id: comment.id)
				replies.destroy_all
			end
			comments.destroy_all

			category_tags = TopicCategoryTag.where(topic_id: params[:id])
			category_tags.destroy_all
			community_tags = TopicCommunityTag.where(topic_id: params[:id])
			community_tags.destroy_all

			topic = Topic.find_by(id: params[:id])

			if topic.destroy
				head :no_content
			else
				render json: {error: account.errors.messages}, status: 422
			end
		end

		def show
			topic = Topic.find_by(id: params[:id])

			render json: TopicSerializer.new(topic).serialized_json
		end

		private
		def options
			@options ||= { include: %i{comments}}
			@options ||= { include: %i{categories}}
			@options ||= { include: %i{communities}}
		end
		def topic_param
			params.require(:topic).permit(:id, :topic_name, :description, :category_id, :upvote, :downvote, :gossip_account_id)
		end
	end
end