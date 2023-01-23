class PinnedCategorySerializer
  include FastJsonapi::ObjectSerializer
  attributes :category_id
  
  belongs_to :gossip_account
end