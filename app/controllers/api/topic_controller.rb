module Api
	class TopicController < ApplicationController
		protect_from_forgery with: :null_session

		def createTopic
			user = authorised_user(params[:token])
			if user == nil
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: 422
			else
				topic = Topic.new(topic_name: params[:topic_name],
				 topic_description: params[:topic_description],
				  gossip_account_id: user.id,
				 active: true, upvote: 0, downvote: 0)
				topic.save
				if params[:categories] != []
					begin
						category_tag = TopicCategoryTag.new(category_id: params[:categories]['value'],
							topic_id: topic.id)
						category_tag.save
					rescue
						for category in params[:categories]
							category_tag = TopicCategoryTag.new(category_id: category['value'],
							 topic_id: topic.id)
							category_tag.save
						end					
					end
				end
				if params[:community_id] != nil
					community_tag = TopicCommunityTag.new(community_id: params[:community_id],
					topic_id: topic.id)
					community = Community.find_by(id: params[:community_id])
					replier = GossipAccount.find_by(id: user.id)
					message = replier.account_name + " has created a new topic in the community " + community.community_name + "!"
					if user.id != community.gossip_account_id
						notification = Notification.new(message: message,
							gossip_account_id: community.gossip_account_id,
							tag: 'topic', topic_id: topic.id)
						notification.save
					end
					community_tag.save
				end
				render json: {data: TopicSerializer.new(topic).serialized_json, isOwner: topic.gossip_account_id == user.id, ownerName: user.account_name}
			end
		end

		def checkTopicLimit
			if params[:category_id] != nil and params[:category_id] != ''
				topics = Topic.belongs_to_category(params[:category_id])
			else
				if params[:community_id] != nil and params[:community_id] != ''
					topics = Topic.belongs_to_community(params[:community_id])
				else
					topics = Topic.all
				end
			end

			render json: topics.length
		end

		def fetchTopics
			if params[:category_id] != nil and params[:category_id] != ''
				topics = Topic.belongs_to_category(params[:category_id]).order(params[:sort_by]).reverse_order().limit(params[:count]).offset(params[:offset])
			else
				if params[:community_id] != nil and params[:community_id] != ''
					topics = Topic.belongs_to_community(params[:community_id]).order(params[:sort_by]).reverse_order().limit(params[:count]).offset(params[:offset])
				else
					topics = Topic.all.order(params[:sort_by]).reverse_order().limit(params[:count]).offset(params[:offset])
				end
			end

			render json: TopicSerializer.new(topics).serialized_json
		end

		def upvoteTopic
			user = authorised_user(params[:token])
			if user != nil
				topicVote = TopicVote.where(gossip_account_id: user.id,
					topic_id: params[:id])[0]
				topic = Topic.find_by(id: params[:id])
				if topicVote == nil
					topic.upvote = topic.upvote + 1
					newTopicVote = TopicVote.new(gossip_account_id: user.id,
						topic_id: params[:id], upvote: true)
					newTopicVote.save
				else
					if topicVote.upvote == true
						topic.upvote = topic.upvote - 1
						topicVote.destroy
					else
						topicVote.upvote = true
						topicVote.save
						topic.upvote = topic.upvote + 1
						topic.downvote = topic.downvote - 1
					end
				end

				if topic.save
					render json: {upvote: topic.upvote, downvote: topic.downvote}
				else
					render json: {error: topic.errors.messages}, status: 422
				end
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def downvoteTopic
			user = authorised_user(params[:token])
			if user != nil
				topicVote = TopicVote.where(gossip_account_id: user.id,
					topic_id: params[:id])[0]
				topic = Topic.find_by(id: params[:id])
				if topicVote == nil
					topic.downvote = topic.downvote + 1
					newTopicVote = TopicVote.new(gossip_account_id: user.id,
						topic_id: params[:id], upvote: false)
					newTopicVote.save
				else
					if topicVote.upvote == false
						topic.downvote = topic.downvote - 1
						topicVote.destroy
					else
						topicVote.upvote = false
						topicVote.save
						topic.upvote = topic.upvote - 1
						topic.downvote = topic.downvote + 1
					end
				end

				if topic.save
					render json: {upvote: topic.upvote, downvote: topic.downvote}
				else
					render json: {error: topic.errors.messages}, status: 422
				end
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end
		
		def editTopic
			user = authorised_user(params[:token])
			if user != nil
				topic = Topic.find_by(id: params[:id])
				topic.topic_name = params[:topic_name]
				topic.topic_description = params[:topic_description]
				topic.save

				category_tags = TopicCategoryTag.where(topic_id: params[:id])
				category_tags.destroy_all
				if params[:categories] != []
					begin
						category_tag = TopicCategoryTag.new(category_id: params[:categories]['value'],
							topic_id: topic.id)
						category_tag.save
					rescue
						for category in params[:categories]
							category_tag = TopicCategoryTag.new(category_id: category['value'],
							 topic_id: topic.id)
							category_tag.save
						end					
					end
				end
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def deleteTopic
			user = authorised_user(params[:token])
			if user != nil
				comments = Comment.where(topic_id: params[:id])
				for comment in comments
					replies = Reply.where(comment_id: comment.id)
					replies.destroy_all
				end
				comments.destroy_all

				category_tags = TopicCategoryTag.where(topic_id: params[:id])
				category_tags.destroy_all
				community_tags = TopicCommunityTag.where(topic_id: params[:id])
				community_tags.destroy_all

				topic = Topic.find_by(id: params[:id])

				if topic.destroy
					head :no_content
				else
					render json: {error: account.errors.messages}, status: 422
				end
			else
				render json: {error: "Unable to identify user, please try logging out and logging in again"}, status: :unauthorized
			end
		end

		def show
			user = authorised_user(request.headers[:token])
			topic = Topic.find_by(id: params[:id])
			owner = GossipAccount.find_by(id: topic.gossip_account_id)
			checkVote = TopicVote.where(gossip_account_id: user.id,
					topic_id: params[:id])[0]
			vote = nil
			if checkVote != nil
				vote =  checkVote.upvote
			end
			checkSave = PinnedTopic.where(gossip_account_id: user.id,
					topic_id: params[:id])[0]
			saved = nil
			if checkSave == nil
				saved = false
			else
				saved = true
			end

			render json: {data: TopicSerializer.new(topic), isOwner: user.id == topic.gossip_account_id, ownerName: owner.account_name, saved: saved, vote: vote}
		end

		private
		def options
			@options ||= { include: %i{comments}}
			@options ||= { include: %i{categories}}
			@options ||= { include: %i{communities}}
		end
	end
end