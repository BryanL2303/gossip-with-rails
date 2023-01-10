class FixNotificationColumnName < ActiveRecord::Migration[7.0]
  def change
    change_table :notifications do |t|
      t.string :tag
      t.remove :type
    end
  end
end
