class ChangeTableNames < ActiveRecord::Migration[7.0]
  def change
    drop_table :comment
    drop_table :topic
    drop_table :reply
    drop_table :notification

    create_table :topics do |t|
      t.string :topic_name
      t.string :description
      t.date :dateCreated
      t.belongs_to :account
      t.belongs_to :favourite, optional: true, null: true

      t.timestamps
    end

    create_table :comments do |t|
      t.string :comment
      t.date :dateCreated
      t.integer :upvote
      t.integer :downvote
      t.belongs_to :account
      t.belongs_to :topic

      t.timestamps
    end

    create_table :replys do |t|
      t.string :reply
      t.date :dateCreated
      t.integer :upvote
      t.integer :downvote
      t.belongs_to :account
      t.belongs_to :comment

      t.timestamps
    end

    create_table :notifications do |t|
      t.string :message
      t.belongs_to :account

      t.timestamps
    end
  end
end
