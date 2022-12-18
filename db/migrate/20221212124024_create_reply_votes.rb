class CreateReplyVotes < ActiveRecord::Migration[7.0]
  def change
    create_table :reply_votes do |t|
      t.boolean :upvote
      t.belongs_to :account
      t.belongs_to :reply

      t.timestamps
    end
  end
end
