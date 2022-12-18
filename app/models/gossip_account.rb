class Account < ApplicationRecord
	has_many :topics
	has_many :favourites
	has_many :comments
	has_many :replys
	has_many :notifications
end
