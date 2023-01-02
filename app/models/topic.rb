class Topic < ApplicationRecord
	belongs_to :gossip_account
	belongs_to :category
	has_many :comments
	has_many :topic_category_tags
	has_many :topic_community_tags
	has_and_belongs_to_many :gossip_accounts, join_table: :pinned_topics
	has_and_belongs_to_many :categories, join_table: :topic_category_tags, through: :topic_category_tags
	has_and_belongs_to_many :communities, join_table: :topic_community_tags, through: :topic_community_tags

	scope :belongs_to_category, -> (category_id) { joins(:topic_category_tags).where("topic_category_tags.category_id = ?", category_id)}
	scope :belongs_to_community, -> (community_id) { joins(:topic_community_tags).where("topic_community_tags.community_id = ?", community_id)}
end
