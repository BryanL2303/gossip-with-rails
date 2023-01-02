module Api
	class PinnedTopicController < ApplicationController
		protect_from_forgery with: :null_session

		def checkSave
			saved = PinnedTopic.where(gossip_account_id: params[:id],
				topic_id: params[:topic_id])[0]
			if saved == nil
				render json: false
			else
				render json: true
			end
		end

		def saveTopic
			vote = PinnedTopic.where(gossip_account_id: params[:id],
				topic_id: params[:topic_id])[0]
			if vote == nil
				topic = PinnedTopic.new(gossip_account_id: params[:id],
					topic_id: params[:topic_id])
				topic.save
			else
				vote.destroy
			end

			topics = PinnedTopic.where(gossip_account_id: params[:id]).order('updated_at')
			render json: PinnedTopicSerializer.new(topics).serialized_json
		end

		def fetchTopics
			topics = PinnedTopic.where(gossip_account_id: params[:id]).order('updated_at')
			render json: PinnedTopicSerializer.new(topics).serialized_json
		end
	end
end