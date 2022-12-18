class CategorySerializer
  include FastJsonapi::ObjectSerializer
  attributes :category, :description, :account_id, :id, :private

  belongs_to :account
  has_many :topics
end