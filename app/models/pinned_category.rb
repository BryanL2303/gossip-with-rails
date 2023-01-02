class PinnedCategory < ApplicationRecord
	belongs_to :gossip_account
	belongs_to :category
end
