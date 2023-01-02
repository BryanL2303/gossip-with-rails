class CommunitySerializer
  include FastJsonapi::ObjectSerializer
  attributes :community_name, :community_description, :id, :upvote, :downvote, :gossip_account_id

  belongs_to :gossip_account
  has_many :topics
  has_many :categories, join_table: 'category_tags'
end