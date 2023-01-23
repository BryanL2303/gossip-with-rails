module Api
	class NotificationController < ApplicationController
		protect_from_forgery with: :null_session

		def fetchNotifications
			user = authorised_user(params[:token])
			notifications = Notification.where(gossip_account_id: user.id)

			render json: NotificationSerializer.new(notifications).serialized_json
		end

		def destroy
			notification = Notification.find_by(id: params[:id])
			
			if notification.destroy
				head :no_content
			else
				render json: {error: account.errors.messages}, status: 422
			end
		end

		def show
			category = Category.find_by(id: params[:id])

			render json: CategorySerializer.new(category).serialized_json
		end
	end
end