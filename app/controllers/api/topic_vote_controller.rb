module Api
	class TopicVoteController < ApplicationController
		protect_from_forgery with: :null_session

		def checkVote
			vote = TopicVote.where(gossip_account_id: params[:account_id],
				topic_id: params[:topic_id])[0]
			if vote == nil
				render json: nil
			else
				render json: vote.upvote
			end
		end
	end
end