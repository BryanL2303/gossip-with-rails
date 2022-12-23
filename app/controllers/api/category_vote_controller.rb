module Api
	class CategoryVoteController < ApplicationController
		protect_from_forgery with: :null_session

		def checkVote
			vote = CategoryVote.where(gossip_account_id: params[:account_id],
				category_id: params[:category_id])[0]
			if vote == nil
				render json: nil
			else
				render json: vote.upvote
			end
		end
	end
end