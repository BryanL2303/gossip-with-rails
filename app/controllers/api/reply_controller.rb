module Api
	class ReplyController < ApplicationController
		protect_from_forgery with: :null_session

		def createReply
			reply = Reply.new(reply: params[:reply],
			 upvote: 0, downvote: 0, gossip_account_id: params[:account_id],
			 comment_id: params[:comment_id], edited: false)
			if reply.save
				render json: ReplySerializer.new(reply).serialized_json
			else
				render json: {error: reply.errors.messages}, status: 422
			end			
		end

		def editReply
			reply = Reply.find_by(id: params[:id])
			reply.edited = true
			reply.reply = params[:reply]

			if reply.save
				render json: ReplySerializer.new(reply).serialized_json
			else
				render json: {error: reply.errors.messages}, status: 422
			end
		end

		def fetchReplys
			replys = Reply.where(comment_id: params[:id]).order('updated_at')

			render json: ReplySerializer.new(replys).serialized_json
		end

		def upvoteReply
			replyVote = ReplyVote.where(gossip_account_id: params[:account_id],
				reply_id: params[:reply_id])[0]
			reply = Reply.find_by(id: params[:id])
			if replyVote == nil
				reply.upvote = reply.upvote + 1
				reply.save
				newReplyVote = ReplyVote.new(gossip_account_id: params[:account_id],
					reply_id: params[:reply_id], upvote: true)
				newReplyVote.save
			else
				if replyVote.upvote == true
					reply.upvote = reply.upvote - 1
					reply.save
					replyVote.destroy
				else
					replyVote.upvote = true
					replyVote.save
					reply.upvote = reply.upvote + 1
					reply.downvote = reply.downvote - 1
					reply.save
				end
			end

			render json: ReplySerializer.new(reply).serialized_json
		end

		def downvoteReply
			replyVote = ReplyVote.where(gossip_account_id: params[:account_id],
				reply_id: params[:reply_id])[0]
			reply = Reply.find_by(id: params[:id])
			if replyVote == nil
				reply.downvote = reply.downvote + 1
				reply.save
				newReplyVote = ReplyVote.new(gossip_account_id: params[:account_id],
					reply_id: params[:reply_id], upvote: false)
				newReplyVote.save
			else
				if replyVote.upvote == false
					reply.downvote = reply.downvote - 1
					reply.save
					replyVote.destroy
				else
					replyVote.upvote = false
					replyVote.save
					reply.upvote = reply.upvote - 1
					reply.downvote = reply.downvote + 1
					reply.save
				end
			end

			render json: ReplySerializer.new(reply).serialized_json
		end

		def destroy
			reply = Reply.find_by(id: params[:id])

			if reply.destroy
				head :no_content
			else
				render json: {error: account.errors.messages}, status: 422
			end
		end

		def show
			reply = Reply.find_by(id: params[:id])

			render json: ReplySerializer.new(reply).serialized_json
		end

		private
		def reply_param
			params.require(:reply).permit(:id, :reply, :comment_id, :account_id)
		end
	end
end