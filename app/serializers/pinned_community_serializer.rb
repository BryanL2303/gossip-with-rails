class PinnedCommunitySerializer
  include FastJsonapi::ObjectSerializer
  attributes :gossip_account_id, :community_id
  
  belongs_to :gossip_account
end