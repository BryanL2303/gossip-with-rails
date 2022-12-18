module Api
	class FavouriteController < ApplicationController
		protect_from_forgery with: :null_session

		def checkSave
			saved = Favourite.where(account_id: params[:id],
				topic_id: params[:topic_id])[0]
			if saved == nil
				render json: false
			else
				render json: true
			end
		end

		def saveTopic
			vote = Favourite.where(account_id: params[:id],
				topic_id: params[:topic_id])[0]
			if vote == nil
				topic = Favourite.new(account_id: params[:id],
					topic_id: params[:topic_id])
				topic.save
			else
				vote.destroy
			end

			topics = Favourite.where(account_id: params[:id]).order('updated_at')
			render json: FavouriteSerializer.new(topics).serialized_json
		end

		def fetchTopics
			topics = Favourite.where(account_id: params[:id]).order('updated_at')
			render json: FavouriteSerializer.new(topics).serialized_json
		end
	end
end