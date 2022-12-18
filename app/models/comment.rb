class Comment < ApplicationRecord
	belongs_to :account
	belongs_to :topic
	has_many :replys
end
