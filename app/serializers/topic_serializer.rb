class TopicSerializer
  include FastJsonapi::ObjectSerializer
  attributes :topic_name, :description, :account_id, :id, :active, :upvote, :downvote, :category_id

  belongs_to :account
  belongs_to :category
  has_many :comments
end