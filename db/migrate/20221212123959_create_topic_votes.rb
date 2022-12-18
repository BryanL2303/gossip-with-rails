class CreateTopicVotes < ActiveRecord::Migration[7.0]
  def change
    create_table :topic_votes do |t|
      t.boolean :upvote
      t.belongs_to :account
      t.belongs_to :topic

      t.timestamps
    end
  end
end
