class CreateReply < ActiveRecord::Migration[7.0]
  def change
    create_table :reply do |t|
      t.string :reply
      t.date :dateCreated
      t.integer :upvote
      t.integer :downvote

      t.timestamps
    end
  end
end
