class NotificationSerializer
  include FastJsonapi::ObjectSerializer
  attributes :gossip_account_id, :message, :topic_id, :comment_id, :reply_id, :tag

  belongs_to :gossip_account
  belongs_to :topic
  belongs_to :comment
  belongs_to :reply
end