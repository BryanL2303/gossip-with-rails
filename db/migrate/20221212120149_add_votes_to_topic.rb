class AddVotesToTopic < ActiveRecord::Migration[7.0]
  def change
    change_table :topics do |t|
      t.integer :upvote
      t.integer :downvote
    end
  end
end
