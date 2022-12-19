class Comment < ApplicationRecord
	belongs_to :gossip_account
	belongs_to :topic
	has_many :replys
end
