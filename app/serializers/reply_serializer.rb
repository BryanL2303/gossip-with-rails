class ReplySerializer
  include FastJsonapi::ObjectSerializer
  attributes :reply, :upvote, :downvote, :comment_id, :edited

  belongs_to :comment
  belongs_to :gossip_account
end