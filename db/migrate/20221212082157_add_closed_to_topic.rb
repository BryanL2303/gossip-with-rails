class AddClosedToTopic < ActiveRecord::Migration[7.0]
  def change
    change_table :topics do |t|
      t.boolean :open
    end
  end
end
