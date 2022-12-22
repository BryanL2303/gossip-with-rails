module Api
	class ReplyVoteController < ApplicationController
		protect_from_forgery with: :null_session

		def checkVote
			vote = ReplyVote.where(gossip_account_id: params[:account_id],
				reply_id: params[:reply_id])[0]
			if vote == nil
				render json: nil
			else
				render json: vote.upvote
			end
		end
	end
end