class PinnedCategorySerializer
  include FastJsonapi::ObjectSerializer
  attributes :account_id, :category_id
  
  belongs_to :account
end