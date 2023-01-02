class GossipAccount < ApplicationRecord
	has_many :communities
	has_many :topics
	has_many :comments
	has_many :replys
	has_many :notifications
	has_and_belongs_to_many :categories, join_table: 'pinned_categories'
	has_and_belongs_to_many :communities, join_table: 'pinned_communities'
	has_and_belongs_to_many :topics, join_table: 'pinned_topics'
end
