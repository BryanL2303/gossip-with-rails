module Api
	class CategoryController < ApplicationController
		protect_from_forgery with: :null_session

		def createCategory
			user = authorised_user(params[:token])
			if user != nil && user.id == 1
				category = Category.new(category_name: params[:category_name],
				 category_description: params[:category_description],
				 upvote: 0, downvote: 0)
				if category.save
					render json: CategorySerializer.new(category).serialized_json
				else
					render json: {error: category.errors.messages}, status: 422
				end
			else
				render json: {error: "Only the Administrator is allowed to do this"}, status: :unauthorized
			end			
		end

		def fetchCategories
			categories = Category.all.order(params[:sort_by])

			render json: CategorySerializer.new(categories).serialized_json
		end

		def show
			category = Category.find_by(id: params[:id])

			render json: CategorySerializer.new(category).serialized_json
		end

		private
		def options
			@options ||= { include: %i{topics}}
		end
	end
end