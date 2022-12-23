class CategoryVoteCount < ActiveRecord::Migration[7.0]
  def change
    change_table :categories do |t|
      t.boolean :active
      t.integer :upvote
      t.integer :downvote
      t.remove :private
    end

    create_table :category_votes do |t|
      t.boolean :upvote
      t.belongs_to :gossip_account
      t.belongs_to :category

      t.timestamps
    end
  end
end
