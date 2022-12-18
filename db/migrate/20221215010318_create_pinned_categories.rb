class CreatePinnedCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :pinned_categories do |t|
      t.belongs_to :account
      t.integer :category_id

      t.timestamps
    end
  end
end
