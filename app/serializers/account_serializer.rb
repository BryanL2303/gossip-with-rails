class AccountSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :password

  has_many :topics
  has_many :comments
  has_many :replys
end