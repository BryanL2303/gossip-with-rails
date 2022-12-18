module Api
	class GossipAccountController < ApplicationController
		protect_from_forgery with: :null_session

		def createAccount
			account = GossipAccount.new(account_name: params[:name], password: params[:password])
			findAccount = GossipAccount.find_by(account_name: params[:name])

			if findAccount == nil
				if account.save
					render json: {'id': account.id, "name": account.account_name}
				else
					render json: {error: account.errors.messages}, status: 422
				end
			else
				render json: false
			end
			
		end

		def authenticateAccount
			account = GossipAccount.find_by(account_name: params[:name])
			if account == nil
				render json: false
			else
				if account.password == params[:password]
					render json: {'id': account.id, "name": account.account_name}
				else
					render json: false
				end
			end
		end

		def destroy
			account = GossipAccount.find_by(id: params[:account_id])
			#Need to loop through all replies, comments and topics related to this account
			#and delete them all

			if account.destroy
				head :no_content
			else
				render json: {error: account.errors.messages}, status: 422
			end
		end

		def show
			account = GossipAccount.find_by(id: params[:account_id])

			render json: GossipAccountSerializer.new(account).serialized_json
		end
	end
end