class Community < ApplicationRecord
	belongs_to :gossip_account
	has_many :topics
	has_many :category_tags
	has_and_belongs_to_many :gossip_accounts, join_table: :pinned_communities
	has_and_belongs_to_many :categories, join_table: :category_tags, through: :category_tags

	scope :belongs_to_category, -> (category_id) { joins(:category_tags).where("category_tags.category_id = ?", category_id)}
end