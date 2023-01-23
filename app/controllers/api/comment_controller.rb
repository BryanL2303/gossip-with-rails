module Api
	class CommentController < ApplicationController
		protect_from_forgery with: :null_session

		def createComment
			user = authorised_user(params[:token])
			if user != nil
				comment = Comment.new(comment: params[:comment],
				 upvote: 0, downvote: 0, gossip_account_id: user.id,
				 topic_id: params[:topic_id], edited: false)
				topic = Topic.find_by(id: params[:topic_id])
				replier = GossipAccount.find_by(id: user.id)
				message = replier.account_name + " has commented on your topic " + topic.topic_name + "!"
				comment.save
				if user.id != topic.gossip_account_id
					notification = Notification.new(message: message,
						gossip_account_id: topic.gossip_account_id,
						tag: 'comment', topic_id: topic.id, comment_id: comment.id)
					notification.save
				end
				render json: CommentSerializer.new(comment).serialized_json
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def editComment
			user = authorised_user(params[:token])
			if user != nil
				comment = Comment.find_by(id: params[:id])
				comment.edited = true
				comment.comment = params[:comment]

				if comment.save
					render json: CommentSerializer.new(comment).serialized_json
				else
					render json: {error: comment.errors.messages}, status: 422
				end
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def fetchComments
			comments = Comment.where(topic_id: params[:id]).order(params[:sort_by]).reverse_order()

			render json: CommentSerializer.new(comments).serialized_json
		end

		def upvoteComment
			user = authorised_user(params[:token])
			if user != nil
				commentVote = CommentVote.where(gossip_account_id: user.id,
					comment_id: params[:id])[0]
				comment = Comment.find_by(id: params[:id])
				if commentVote == nil
					comment.upvote = comment.upvote + 1
					comment.save
					newCommentVote = CommentVote.new(gossip_account_id: user.id,
						comment_id: params[:id], upvote: true)
					newCommentVote.save
				else
					if commentVote.upvote == true
						comment.upvote = comment.upvote - 1
						comment.save
						commentVote.destroy
					else
						commentVote.upvote = true
						commentVote.save
						comment.upvote = comment.upvote + 1
						comment.downvote = comment.downvote - 1
						comment.save
					end
				end

				render json: CommentSerializer.new(comment).serialized_json
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def downvoteComment
			user = authorised_user(params[:token])
			if user != nil
				commentVote = CommentVote.where(gossip_account_id: user.id,
					comment_id: params[:id])[0]
				comment = Comment.find_by(id: params[:id])
				if commentVote == nil
					comment.downvote = comment.downvote + 1
					comment.save
					newCommentVote = CommentVote.new(gossip_account_id: user.id,
						comment_id: params[:id], upvote: false)
					newCommentVote.save
				else
					if commentVote.upvote == false
						comment.downvote = comment.downvote - 1
						comment.save
						commentVote.destroy
					else
						commentVote.upvote = false
						commentVote.save
						comment.upvote = comment.upvote - 1
						comment.downvote = comment.downvote + 1
						comment.save
					end
				end

				render json: CommentSerializer.new(comment).serialized_json
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def destroy
			comment = Comment.find_by(id: params[:id])
			replys = Reply.where(comment_id: params[:id])
			replys.destroy_all

			if comment.destroy
				head :no_content
			else
				render json: {error: account.errors.messages}, status: 422
			end
		end

		def show
			user = authorised_user(request.headers[:token])
			comment = Comment.find_by(id: params[:id])
			owner = GossipAccount.find_by(id: comment.gossip_account_id)
			checkVote = CommentVote.where(gossip_account_id: user.id,
					comment_id: params[:id])[0]
			vote = nil
			if checkVote != nil
				vote =  checkVote.upvote
			end

			render json: {data: CommentSerializer.new(comment), isOwner: user.id == comment.gossip_account_id, ownerName: owner.account_name, vote: vote}
		end

		private
		def options
			@options ||= { include: %i{replys}}
		end
	end
end