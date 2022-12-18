class Favourite < ApplicationRecord
	belongs_to :account
	has_many :topics
end
