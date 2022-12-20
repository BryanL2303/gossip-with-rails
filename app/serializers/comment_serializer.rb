class CommentSerializer
  include FastJsonapi::ObjectSerializer
  attributes :comment, :upvote, :downvote, :topic_id, :edited, :gossip_account_id
  
  has_many :replys
  belongs_to :topic
  belongs_to :gossip_account
end