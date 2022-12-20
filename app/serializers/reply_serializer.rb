class ReplySerializer
  include FastJsonapi::ObjectSerializer
  attributes :reply, :upvote, :downvote, :comment_id, :edited, :gossip_account_id

  belongs_to :comment
  belongs_to :gossip_account
end