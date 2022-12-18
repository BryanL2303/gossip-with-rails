class RemoveUnnecessaryDateColumn < ActiveRecord::Migration[7.0]
  def change
    change_table :topics do |t|
      t.remove :dateCreated
    end

    change_table :comments do |t|
      t.remove :dateCreated
    end

    change_table :replys do |t|
      t.remove :dateCreated
    end
  end
end
