class FavouriteSerializer
  include FastJsonapi::ObjectSerializer
  attributes :gossip_account_id, :topic_id
  
  belongs_to :gossip_account
end