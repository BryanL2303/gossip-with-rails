class CategorySerializer
  include FastJsonapi::ObjectSerializer
  attributes :category_name, :category_description, :id, :upvote, :downvote

  has_many :communities
  has_many :topics
end