module Api
	class CommentVoteController < ApplicationController
		protect_from_forgery with: :null_session

		def checkVote
			vote = CommentVote.where(gossip_account_id: params[:account_id],
				comment_id: params[:comment_id])[0]
			if vote == nil
				render json: nil
			else
				render json: vote.upvote
			end
		end
	end
end