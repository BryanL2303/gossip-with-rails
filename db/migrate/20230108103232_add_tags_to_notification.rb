class AddTagsToNotification < ActiveRecord::Migration[7.0]
  def change
    change_table :notifications do |t|
      t.string :type
      t.belongs_to :topic
      t.belongs_to :comment
      t.belongs_to :reply
    end
  end
end
