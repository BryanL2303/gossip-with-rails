class Category < ApplicationRecord
	belongs_to :gossip_account
	has_many :communities
	has_many :topics
	has_and_belongs_to_many :gossip_account, join_table: 'pinned_categories'
	has_and_belongs_to_many :community, join_table: 'category_tags'
end
