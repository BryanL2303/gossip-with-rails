class CreateTables < ActiveRecord::Migration[7.0]
  def change
    create_table :gossip_accounts do |t|
      t.string :account_name
      t.string :password

      t.timestamps
    end

    create_table :categories do |t|
      t.string :category
      t.string :description
      t.boolean :private
      t.belongs_to :gossip_account

      t.timestamps
    end

    create_table :topics do |t|
      t.string :topic_name
      t.string :description
      t.date :dateCreated
      t.integer :upvote
      t.integer :downvote
      t.boolean :active
      t.belongs_to :gossip_account
      t.belongs_to :category, optional: true, null: true

      t.timestamps
    end

    create_table :favourites do |t|
      t.integer :topic_id
      t.belongs_to :gossip_account

      t.timestamps
    end

    create_table :comments do |t|
      t.string :comment
      t.date :dateCreated
      t.integer :upvote
      t.integer :downvote
      t.boolean :edited
      t.belongs_to :gossip_account
      t.belongs_to :topic

      t.timestamps
    end

    create_table :replys do |t|
      t.string :reply
      t.date :dateCreated
      t.integer :upvote
      t.integer :downvote
      t.boolean :edited
      t.belongs_to :gossip_account
      t.belongs_to :comment

      t.timestamps
    end

    create_table :pinned_categories do |t|
      t.belongs_to :gossip_account
      t.integer :category_id

      t.timestamps
    end

    create_table :topic_votes do |t|
      t.boolean :upvote
      t.belongs_to :gossip_account
      t.belongs_to :topic

      t.timestamps
    end

    create_table :comment_votes do |t|
      t.boolean :upvote
      t.belongs_to :gossip_account
      t.belongs_to :comment

      t.timestamps
    end

    create_table :reply_votes do |t|
      t.boolean :upvote
      t.belongs_to :gossip_account
      t.belongs_to :reply

      t.timestamps
    end
  end
end
