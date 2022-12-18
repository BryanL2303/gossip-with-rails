class CreateNotification < ActiveRecord::Migration[7.0]
  def change
    create_table :notification do |t|
      t.string :message

      t.timestamps
    end
  end
end
