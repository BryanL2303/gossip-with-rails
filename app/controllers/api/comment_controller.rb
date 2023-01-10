module Api
	class CommentController < ApplicationController
		protect_from_forgery with: :null_session

		def createComment
			comment = Comment.new(comment: params[:comment],
			 upvote: 0, downvote: 0, gossip_account_id: params[:account_id],
			 topic_id: params[:topic_id], edited: false)
			topic = Topic.find_by(id: params[:topic_id])
			replier = GossipAccount.find_by(id: params[:account_id])
			message = replier.account_name + " has commented on your topic " + topic.topic_name + "!"
			comment.save
			notification = Notification.new(message: message,
				gossip_account_id: topic.gossip_account_id,
				tag: 'comment', topic_id: topic.id, comment_id: comment.id)
			if notification.save
				render json: CommentSerializer.new(comment).serialized_json
			else
				render json: {error: comment.errors.messages}, status: 422
			end			
		end

		def editComment
			comment = Comment.find_by(id: params[:id])
			comment.edited = true
			comment.comment = params[:comment]

			if comment.save
				render json: CommentSerializer.new(comment).serialized_json
			else
				render json: {error: comment.errors.messages}, status: 422
			end			
		end

		def fetchComments
			comments = Comment.where(topic_id: params[:id]).order(params[:sort_by]).reverse_order()

			render json: CommentSerializer.new(comments).serialized_json
		end

		def upvoteComment
			commentVote = CommentVote.where(gossip_account_id: params[:account_id],
				comment_id: params[:id])[0]
			comment = Comment.find_by(id: params[:id])
			if commentVote == nil
				comment.upvote = comment.upvote + 1
				comment.save
				newCommentVote = CommentVote.new(gossip_account_id: params[:account_id],
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
		end

		def downvoteComment
			commentVote = CommentVote.where(gossip_account_id: params[:account_id],
				comment_id: params[:id])[0]
			comment = Comment.find_by(id: params[:id])
			if commentVote == nil
				comment.downvote = comment.downvote + 1
				comment.save
				newCommentVote = CommentVote.new(gossip_account_id: params[:account_id],
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
			comment = Comment.find_by(id: params[:id])

			render json: CommentSerializer.new(comment).serialized_json
		end

		private
		def options
			@options ||= { include: %i{replys}}
		end
		def comment_param
			params.require(:comment).permit(:id, :comment, :topic_id)
		end
	end
end