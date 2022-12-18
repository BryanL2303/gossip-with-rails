class NotificationSerializer
  include FastJsonapi::ObjectSerializer
  attributes :message

  #has_many :projects
  #has_many :tasks
end