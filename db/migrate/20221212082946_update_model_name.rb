class UpdateModelName < ActiveRecord::Migration[7.0]
  def change
    change_table :topics do |t|
      t.remove :open
      t.boolean :active
    end
  end
end
