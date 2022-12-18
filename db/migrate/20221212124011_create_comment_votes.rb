class CreateCommentVotes < ActiveRecord::Migration[7.0]
  def change
    create_table :comment_votes do |t|
      t.boolean :upvote
      t.belongs_to :account
      t.belongs_to :comment

      t.timestamps
    end
  end
end
