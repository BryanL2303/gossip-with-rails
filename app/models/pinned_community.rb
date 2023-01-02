class PinnedCommunity < ApplicationRecord
	belongs_to :gossip_account
	belongs_to :community
end
