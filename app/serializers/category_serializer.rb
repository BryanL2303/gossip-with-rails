class CategorySerializer
  include FastJsonapi::ObjectSerializer
  attributes :category, :description, :gossip_account_id, :id, :active, :upvote, :downvote

  belongs_to :gossip_account
  has_many :topics
end