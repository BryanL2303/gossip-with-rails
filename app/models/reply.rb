class Reply < ApplicationRecord
	belongs_to :gossip_account
	belongs_to :comment
end
