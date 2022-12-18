class CreateTopic < ActiveRecord::Migration[7.0]
  def change
    create_table :topic do |t|
      t.string :name
      t.string :description
      t.date :dateCreated

      t.timestamps
    end
  end
end
