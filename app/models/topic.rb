class Topic < ApplicationRecord
	belongs_to :gossip_account
	belongs_to :category
	has_many :comments
end
