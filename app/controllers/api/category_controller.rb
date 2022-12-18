module Api
	class CategoryController < ApplicationController
		protect_from_forgery with: :null_session

		def createCategory
			category = Category.new(category: params[:category],
			 description: params[:description], account_id: params[:account_id],
			 private: false)
			if category.save
				render json: CategorySerializer.new(category).serialized_json
			else
				render json: {error: category.errors.messages}, status: 422
			end			
		end

		def fetchCategories
			categories = Category.all.order('updated_at')

			render json: CategorySerializer.new(categories).serialized_json
		end

		def createTopic
			topic = Topic.new(topic_name: params[:topic_name],
			 description: params[:description], account_id: params[:account_id],
			 active: true, category_id: params[:id])
			if topic.save
				render json: TopicSerializer.new(topic).serialized_json
			else
				render json: {error: topic.errors.messages}, status: 422
			end			
		end

		def fetchTopics
			topics = Topic.where(category_id: params[:id]).order('updated_at')

			render json: TopicSerializer.new(topics).serialized_json		
		end

		def closeTopic
			topic = Topic.find_by(id: params[:id])
			topic.active = false
			topic.save

			render json: TopicSerializer.new(topic).serialized_json
		end

		def destroy
			account = Account.find_by(id: params[:account_id])
			comments = Comment.where(topic_id: topic.id)
			comments.destroy_all
			#Loop through comments to destroy all replies
			topic = Topic.find_by(id: params[:topic_id])

			if topic.destroy
				head :no_content
			else
				render json: {error: account.errors.messages}, status: 422
			end
		end

		def show
			category = Category.find_by(id: params[:id])

			render json: CategorySerializer.new(category).serialized_json
		end

		private
		def options
			@options ||= { include: %i{topics}}
		end
		def category_param
			params.require(:category).permit(:id, :category, :description)
		end
	end
end