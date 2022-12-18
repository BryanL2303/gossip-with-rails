class GossipAccountSerializer
  include FastJsonapi::ObjectSerializer
  attributes :account_name, :password

  has_many :topics
  has_many :comments
  has_many :replys
end