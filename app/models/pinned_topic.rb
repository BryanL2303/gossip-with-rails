class PinnedTopic < ApplicationRecord
	belongs_to :gossip_account
	belongs_to :topic
end
