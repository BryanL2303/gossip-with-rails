class TopicCommunityTag < ApplicationRecord
	belongs_to :topic
	belongs_to :community
end