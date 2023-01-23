class PinnedCommunitySerializer
  include FastJsonapi::ObjectSerializer
  attributes :community_id
  
  belongs_to :gossip_account
end