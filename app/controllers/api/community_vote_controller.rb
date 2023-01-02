module Api
	class CommunityVoteController < ApplicationController
		protect_from_forgery with: :null_session

		def checkVote
			vote = CommunityVote.where(gossip_account_id: params[:account_id],
				community_id: params[:community_id])[0]
			if vote == nil
				render json: nil
			else
				render json: vote.upvote
			end
		end
	end
end