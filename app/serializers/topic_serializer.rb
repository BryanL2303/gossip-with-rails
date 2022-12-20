class TopicSerializer
  include FastJsonapi::ObjectSerializer
  attributes :topic_name, :description, :gossip_account_id, :id, :active, :upvote, :downvote, :category_id

  belongs_to :gossip_account
  belongs_to :category
  has_many :comments
end