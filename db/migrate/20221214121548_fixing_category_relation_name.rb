class FixingCategoryRelationName < ActiveRecord::Migration[7.0]
  def change
    change_table :topics do |t|
      t.remove :category_id
      t.belongs_to :category, optional: true, null: true
    end
  end
end
