module Api
	class TopicController < ApplicationController
		protect_from_forgery with: :null_session

		def createTopic
			topic = Topic.new(topic_name: params[:topic_name],
			 description: params[:description], gossip_account_id: params[:account_id],
			 active: true)
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

		def upvoteTopic
			topicVote = TopicVote.where(gossip_account_id: params[:account_id],
				topic_id: params[:id])[0]
			topic = Topic.find_by(id: params[:id])
			if topicVote == nil
				topic.upvote = (topic.upvote.to_i + 1).to_s
				newTopicVote = TopicVote.new(gossip_account_id: params[:account_id],
					topic_id: params[:id], upvote: true)
				newTopicVote.save
			else
				if topicVote.upvote == true
					topic.upvote = (topic.upvote.to_i - 1).to_s
					topicVote.destroy
				else
					topicVote.upvote = true
					topicVote.save
					topic.upvote = (topic.upvote.to_i + 1).to_s
					topic.downvote = (topic.downvote.to_i - 1).to_s
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
				topic.save
				newTopicVote = TopicVote.new(gossip_account_id: params[:account_id],
					topic_id: params[:id], upvote: false)
				newTopicVote.save
			else
				if topicVote.upvote == false
					topic.downvote = topic.downvote - 1
					topic.save
					topicVote.destroy
				else
					topicVote.upvote = false
					topicVote.save
					topic.downvote = topic.downvote + 1
					topic.upvote = topic.upvote - 1
					topic.save
				end
			end

			render json: TopicSerializer.new(topic).serialized_json
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