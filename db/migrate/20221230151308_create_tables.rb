class CreateTables < ActiveRecord::Migration[7.0]
  def change
    create_table :gossip_accounts do |t|
      t.string :account_name
      t.string :password

      t.timestamps
    end

    create_table :categories do |t|
      t.string :category_name
      t.string :category_description
      t.integer :upvote
      t.integer :downvote
      
      t.timestamps
    end

    create_table :pinned_categories do |t|
      t.belongs_to :gossip_account
      t.belongs_to :category

      t.timestamps
    end

    create_table :communities do |t|
      t.string :community_name
      t.string :community_description
      t.integer :upvote
      t.integer :downvote
      t.belongs_to :gossip_account

      t.timestamps
    end

    create_table :pinned_communities do |t|
      t.belongs_to :gossip_account
      t.belongs_to :community

      t.timestamps
    end

    create_table :category_tags do |t|
      t.belongs_to :category
      t.belongs_to :community

      t.timestamps
    end

    create_table :topics do |t|
      t.string :topic_name
      t.string :topic_description
      t.integer :upvote
      t.integer :downvote
      t.boolean :active
      t.belongs_to :gossip_account
      t.belongs_to :community, optional: true, null: true
      t.belongs_to :category, optional: true, null: true

      t.timestamps
    end

    create_table :pinned_topics do |t|
      t.belongs_to :gossip_account
      t.belongs_to :topic

      t.timestamps
    end

    create_table :comments do |t|
      t.string :comment
      t.integer :upvote
      t.integer :downvote
      t.boolean :edited
      t.belongs_to :gossip_account
      t.belongs_to :topic

      t.timestamps
    end

    create_table :replies do |t|
      t.string :reply
      t.integer :upvote
      t.integer :downvote
      t.boolean :edited
      t.belongs_to :gossip_account
      t.belongs_to :comment

      t.timestamps
    end

    create_table :category_votes do |t|
      t.boolean :upvote
      t.belongs_to :gossip_account
      t.belongs_to :category

      t.timestamps
    end

    create_table :community_votes do |t|
      t.boolean :upvote
      t.belongs_to :gossip_account
      t.belongs_to :community

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

    create_table :topic_category_tags do |t|
      t.belongs_to :category
      t.belongs_to :topic

      t.timestamps
    end

    create_table :topic_community_tags do |t|
      t.belongs_to :topic
      t.belongs_to :community

      t.timestamps
    end

    create_table :notifications do |t|
      t.string :message
      t.belongs_to :gossip_account

      t.timestamps
    end
  end
end
