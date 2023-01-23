class TopicSerializer
  include FastJsonapi::ObjectSerializer
  attributes :topic_name, :topic_description, :id, :active, :upvote, :downvote

  belongs_to :gossip_account
  has_many :comments
  has_many :categories, join_table: 'topic_category_tags'
  has_many :communities, join_table: 'topic_community_tags'
end