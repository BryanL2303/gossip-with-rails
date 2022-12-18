class CreateCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :categories do |t|
      t.string :category
      t.string :description
      t.boolean :private
      t.belongs_to :account

      t.timestamps
    end

    change_table :topics do |t|
      t.belongs_to :categories, optional: true, null: true
    end
  end
end
