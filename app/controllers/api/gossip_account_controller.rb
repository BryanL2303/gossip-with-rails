module Api
	class GossipAccountController < ApplicationController
		protect_from_forgery with: :null_session

		def createAccount
			account = GossipAccount.new(account_name: params[:name], password: params[:password])
			findAccount = GossipAccount.find_by(account_name: params[:name])

			if findAccount == nil
				if account.save
					token = encode_token({user_id: account.id})
					render json: {name: account.account_name, token: token}
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
					token = encode_token({user_id: account.id})
					render json: {"name": account.account_name, token: token}
				else
					render json: false
				end
			end
		end

		def show
			user = authorised_user(request.headers[:token])
			account = GossipAccount.find_by(id: user.id)
			render json: {name: account.account_name}
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
	end
end