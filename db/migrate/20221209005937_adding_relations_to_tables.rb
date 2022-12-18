class AddingRelationsToTables < ActiveRecord::Migration[7.0]
  def change
    change_table :accounts do |t|
      t.remove :name
      t.string :account_name
      t.belongs_to :calender, optional: true, null: true
      t.belongs_to :project, optional: true, null: true 
    end

    change_table :topic do |t|
      t.remove :name
      t.integer :topic_name
      t.belongs_to :account
      t.belongs_to :favourite, optional: true, null: true 
    end

    change_table :comment do |t|
      t.belongs_to :account
      t.belongs_to :topic
    end

    change_table :reply do |t|
      t.belongs_to :account
      t.belongs_to :comment
    end

    change_table :favourites do |t|
      t.belongs_to :account
    end

    change_table :notification do |t|
      t.belongs_to :account
    end
  end
end
