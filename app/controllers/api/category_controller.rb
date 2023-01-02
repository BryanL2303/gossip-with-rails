module Api
	class CategoryController < ApplicationController
		protect_from_forgery with: :null_session

		def createCategory
			category = Category.new(category_name: params[:category_name],
			 category_description: params[:category_description],
			 upvote: 0, downvote: 0)
			if category.save
				render json: CategorySerializer.new(category).serialized_json
			else
				render json: {error: category.errors.messages}, status: 422
			end			
		end

		def fetchCategories
			categories = Category.all.order(params[:sort_by])

			render json: CategorySerializer.new(categories).serialized_json
		end

		def createTopic
			topic = Topic.new(topic_name: params[:topic_name],
			 topic_description: params[:topic_description],
			 gossip_account_id: params[:account_id],
			 active: true, category_id: params[:id], upvote: 0, downvote: 0)
			if topic.save
				render json: TopicSerializer.new(topic).serialized_json
			else
				render json: {error: topic.errors.messages}, status: 422
			end			
		end

		def fetchTopics
			topics = Topic.where(category_id: params[:id]).order(params[:sort_by])

			render json: TopicSerializer.new(topics).serialized_json		
		end

		def closeCategory
			category = Category.find_by(id: params[:id])
			category.active = false
			category.save

			#Need to find a way to indicate to all topics that they are closed and cannot be opened

			render json: CategorySerializer.new(category).serialized_json
		end

		def openCategory
			category = Category.find_by(id: params[:id])
			category.active = true
			category.save

			render json: CategorySerializer.new(category).serialized_json
		end

		def destroy
			account = GossipAccount.find_by(id: params[:account_id])
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

		def upvoteCategory
			categoryVote = CategoryVote.where(gossip_account_id: params[:account_id],
				category_id: params[:id])[0]
			category = Category.find_by(id: params[:id])
			if categoryVote == nil
				category.upvote = category.upvote + 1
				newCategoryVote = CategoryVote.new(gossip_account_id: params[:account_id],
					category_id: params[:id], upvote: true)
				newCategoryVote.save
			else
				if categoryVote.upvote == true
					category.upvote = category.upvote - 1
					categoryVote.destroy
				else
					categoryVote.upvote = true
					categoryVote.save
					category.upvote = category.upvote + 1
					category.downvote = category.downvote - 1
				end
			end
			category.save

			render json: CategorySerializer.new(category).serialized_json
		end

		def downvoteCategory
			categoryVote = CategoryVote.where(gossip_account_id: params[:account_id],
				category_id: params[:id])[0]
			category = Category.find_by(id: params[:id])
			if categoryVote == nil
				category.downvote = category.downvote + 1
				newCategoryVote = CategoryVote.new(gossip_account_id: params[:account_id],
					category_id: params[:id], upvote: false)
				newCategoryVote.save
			else
				if categoryVote.upvote == false
					category.downvote = category.downvote - 1
					categoryVote.destroy
				else
					categoryVote.upvote = false
					categoryVote.save
					category.upvote = category.upvote - 1
					category.downvote = category.downvote + 1
				end
			end
			category.save

			render json: CategorySerializer.new(category).serialized_json
		end

		private
		def options
			@options ||= { include: %i{topics}}
		end
		def category_param
			params.require(:category).permit(:id, :category_name, :category_description)
		end
	end
end