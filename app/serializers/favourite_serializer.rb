class FavouriteSerializer
  include FastJsonapi::ObjectSerializer
  attributes :account_id, :topic_id
  
  belongs_to :account
end