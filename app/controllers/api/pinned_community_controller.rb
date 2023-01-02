module Api
	class PinnedCommunityController < ApplicationController
		protect_from_forgery with: :null_session

		def checkSave
			saved = PinnedCommunity.where(gossip_account_id: params[:id],
				community_id: params[:community_id])[0]
			if saved == nil
				render json: false
			else
				render json: true
			end
		end

		def saveCommunity
			vote = PinnedCommunity.where(gossip_account_id: params[:id],
				community_id: params[:community_id])[0]
			if vote == nil
				community = PinnedCommunity.new(gossip_account_id: params[:id],
					community_id: params[:community_id])
				community.save
			else
				vote.destroy
			end

			communities = PinnedCommunity.where(gossip_account_id: params[:id]).order('updated_at')
			render json: PinnedCommunitySerializer.new(communities).serialized_json
		end

		def fetchCommunities
			communities = PinnedCommunity.where(gossip_account_id: params[:id]).order('updated_at')
			render json: PinnedCommunitySerializer.new(communities).serialized_json
		end
	end
end