class Topic < ApplicationRecord
	belongs_to :account
	belongs_to :category
	has_many :comments
end
