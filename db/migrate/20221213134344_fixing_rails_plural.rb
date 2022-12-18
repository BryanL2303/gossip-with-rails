class FixingRailsPlural < ActiveRecord::Migration[7.0]
  def change
    change_table :topics do |t|
      t.integer :category_id
      t.remove :categories_id
    end
  end
end
