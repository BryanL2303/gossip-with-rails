module Api
	class TopicController < ApplicationController
		protect_from_forgery with: :null_session

		def createTopic
			topic = Topic.new(topic_name: params[:topic_name],
			 description: params[:description], gossip_account_id: params[:account_id],
			 active: true, upvote: 0, downvote: 0)
			if topic.save
				render json: TopicSerializer.new(topic).serialized_json
			else
				render json: {error: topic.errors.messages}, status: 422
			end			
		end

		def fetchTopics
			topics = Topic.all.order('updated_at')

			render json: TopicSerializer.new(topics).serialized_json
		end

		def closeTopic
			topic = Topic.find_by(id: params[:id])
			topic.active = false
			topic.save

			render json: TopicSerializer.new(topic).serialized_json
		end

		def resetTopic
			topic = Topic.find_by(id: 1)
			topic.upvote = 0
			topic.downvote = 0
			topic.save
			topic = Topic.find_by(id: 2)
			topic.upvote = 1
			topic.downvote = 0
			topic.save
			topic = Topic.find_by(id: 3)
			topic.upvote = 0
			topic.downvote = 0
			topic.save
			topic = Topic.find_by(id: 4)
			topic.upvote = 0
			topic.downvote = 0
			topic.save
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
			topic = Topic.find_by(id: params[:id])

			render json: TopicSerializer.new(topic).serialized_json
		end

		private
		def options
			@options ||= { include: %i{comments}}
		end
		def topic_param
			params.require(:topic).permit(:id, :topic_name, :description, :category_id, :upvote, :downvote, :account_id)
		end
	end
end