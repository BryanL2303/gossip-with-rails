class PinnedCategorySerializer
  include FastJsonapi::ObjectSerializer
  attributes :gossip_account_id, :category_id
  
  belongs_to :gossip_account
end