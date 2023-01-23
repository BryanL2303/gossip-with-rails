module Api
	class PinnedTopicController < ApplicationController
		protect_from_forgery with: :null_session

		def saveTopic
			user = authorised_user(params[:token])
			if user != nil
				vote = PinnedTopic.where(gossip_account_id: user.id,
					topic_id: params[:topic_id])[0]
				if vote == nil
					topic = PinnedTopic.new(gossip_account_id: user.id,
						topic_id: params[:topic_id])
					topic.save
				else
					vote.destroy
				end

				topics = PinnedTopic.where(gossip_account_id: user.id).order('updated_at')
				render json: PinnedTopicSerializer.new(topics).serialized_json
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def fetchTopics
			user = authorised_user(params[:token])
			if user != nil
				topics = PinnedTopic.where(gossip_account_id: user.id).order('updated_at')
				render json: PinnedTopicSerializer.new(topics).serialized_json
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end
	end
end