module Api
	class PinnedCategoryController < ApplicationController
		protect_from_forgery with: :null_session

		def checkSave
			saved = PinnedCategory.where(account_id: params[:id],
				category_id: params[:category_id])[0]
			if saved == nil
				render json: false
			else
				render json: true
			end
		end

		def saveCategory
			pin = PinnedCategory.where(account_id: params[:id],
				category_id: params[:category_id])[0]
			if pin == nil
				saved = PinnedCategory.new(account_id: params[:id],
					category_id: params[:category_id])
				saved.save
			else
				pin.destroy
			end

			categories = PinnedCategory.where(account_id: params[:id]).order('updated_at')
			render json: PinnedCategorySerializer.new(categories).serialized_json
		end

		def fetchCategories
			categories = PinnedCategory.where(account_id: params[:id]).order('updated_at')
			render json: PinnedCategorySerializer.new(categories).serialized_json
		end
	end
end