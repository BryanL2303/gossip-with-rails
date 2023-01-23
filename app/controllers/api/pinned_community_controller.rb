module Api
	class PinnedCommunityController < ApplicationController
		protect_from_forgery with: :null_session

		def saveCommunity
			user = authorised_user(params[:token])
			if user != nil
				vote = PinnedCommunity.where(gossip_account_id: user.id,
					community_id: params[:community_id])[0]
				if vote == nil
					community = PinnedCommunity.new(gossip_account_id: user.id,
						community_id: params[:community_id])
					community.save
				else
					vote.destroy
				end

				communities = PinnedCommunity.where(gossip_account_id: user.id).order('updated_at')
				render json: PinnedCommunitySerializer.new(communities).serialized_json
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def fetchCommunities
			user = authorised_user(params[:token])
			if user != nil
				communities = PinnedCommunity.where(gossip_account_id: user.id).order('updated_at')
				render json: PinnedCommunitySerializer.new(communities).serialized_json
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end
	end
end