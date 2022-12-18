class AddEditedTag < ActiveRecord::Migration[7.0]
  def change
    change_table :comments do |t|
      t.boolean :edited
    end

    change_table :replys do |t|
      t.boolean :edited
    end
  end
end
