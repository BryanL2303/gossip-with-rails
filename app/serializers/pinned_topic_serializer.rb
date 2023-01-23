class PinnedTopicSerializer
  include FastJsonapi::ObjectSerializer
  attributes :topic_id
  
  belongs_to :gossip_account
end