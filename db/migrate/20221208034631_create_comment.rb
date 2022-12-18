class CreateComment < ActiveRecord::Migration[7.0]
  def change
    create_table :comment do |t|
      t.string :comment
      t.date :dateCreated
      t.integer :upvote
      t.integer :downvote

      t.timestamps
    end
  end
end
