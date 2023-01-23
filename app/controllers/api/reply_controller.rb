module Api
	class ReplyController < ApplicationController
		protect_from_forgery with: :null_session

		def createReply
			user = authorised_user(params[:token])
			if user != nil
				reply = Reply.new(reply: params[:reply],
				 upvote: 0, downvote: 0, gossip_account_id: user.id,
				 comment_id: params[:comment_id], edited: false)
				comment = Comment.find_by(id: params[:comment_id])
				topic = Topic.find_by(id: comment.topic_id)
				replier = GossipAccount.find_by(id: user.id)
				message = replier.account_name + " has replied to your comment on " + topic.topic_name + "!"
				reply.save
				if user.id != comment.gossip_account_id
					notification = Notification.new(message: message,
						gossip_account_id: comment.gossip_account_id,
						tag: 'reply', topic_id: topic.id, reply_id: reply.id)
					notification.save
				end
				render json: ReplySerializer.new(reply).serialized_json
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def editReply
			user = authorised_user(params[:token])
			if user != nil
				reply = Reply.find_by(id: params[:id])
				reply.edited = true
				reply.reply = params[:reply]

				if reply.save
					render json: ReplySerializer.new(reply).serialized_json
				else
					render json: {error: reply.errors.messages}, status: 422
				end
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def fetchReplys
			replys = Reply.where(comment_id: params[:id]).order('updated_at')

			render json: ReplySerializer.new(replys).serialized_json
		end

		def upvoteReply
			user = authorised_user(params[:token])
			if user != nil
				replyVote = ReplyVote.where(gossip_account_id: user.id,
					reply_id: params[:id])[0]
				reply = Reply.find_by(id: params[:id])
				if replyVote == nil
					reply.upvote = reply.upvote + 1
					reply.save
					newReplyVote = ReplyVote.new(gossip_account_id: user.id,
						reply_id: params[:id], upvote: true)
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
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def downvoteReply
			user = authorised_user(params[:token])
			if user != nil
				replyVote = ReplyVote.where(gossip_account_id: user.id,
					reply_id: params[:id])[0]
				reply = Reply.find_by(id: params[:id])
				if replyVote == nil
					reply.downvote = reply.downvote + 1
					reply.save
					newReplyVote = ReplyVote.new(gossip_account_id: user.id,
						reply_id: params[:id], upvote: false)
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
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
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
			user = authorised_user(request.headers[:token])
			reply = Reply.find_by(id: params[:id])
			owner = GossipAccount.find_by(id: reply.gossip_account_id)
			checkVote = ReplyVote.where(gossip_account_id: user.id,
					reply_id: params[:id])[0]
			vote = nil
			if checkVote != nil
				vote =  checkVote.upvote
			end

			render json: {data: ReplySerializer.new(reply), isOwner: user.id == reply.gossip_account_id, ownerName: owner.account_name, vote: vote}
		end
	end
end