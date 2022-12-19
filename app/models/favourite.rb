class Favourite < ApplicationRecord
	belongs_to :gossip_account
	has_many :topics
end
