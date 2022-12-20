# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_12_07_151308) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "category"
    t.string "description"
    t.boolean "private"
    t.bigint "gossip_account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gossip_account_id"], name: "index_categories_on_gossip_account_id"
  end

  create_table "comment_votes", force: :cascade do |t|
    t.boolean "upvote"
    t.bigint "gossip_account_id"
    t.bigint "comment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_comment_votes_on_comment_id"
    t.index ["gossip_account_id"], name: "index_comment_votes_on_gossip_account_id"
  end

  create_table "comments", force: :cascade do |t|
    t.string "comment"
    t.date "dateCreated"
    t.integer "upvote"
    t.integer "downvote"
    t.boolean "edited"
    t.bigint "gossip_account_id"
    t.bigint "topic_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gossip_account_id"], name: "index_comments_on_gossip_account_id"
    t.index ["topic_id"], name: "index_comments_on_topic_id"
  end

  create_table "favourites", force: :cascade do |t|
    t.integer "topic_id"
    t.bigint "gossip_account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gossip_account_id"], name: "index_favourites_on_gossip_account_id"
  end

  create_table "gossip_accounts", force: :cascade do |t|
    t.string "account_name"
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "pinned_categories", force: :cascade do |t|
    t.bigint "gossip_account_id"
    t.integer "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gossip_account_id"], name: "index_pinned_categories_on_gossip_account_id"
  end

  create_table "reply_votes", force: :cascade do |t|
    t.boolean "upvote"
    t.bigint "gossip_account_id"
    t.bigint "reply_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gossip_account_id"], name: "index_reply_votes_on_gossip_account_id"
    t.index ["reply_id"], name: "index_reply_votes_on_reply_id"
  end

  create_table "replys", force: :cascade do |t|
    t.string "reply"
    t.date "dateCreated"
    t.integer "upvote"
    t.integer "downvote"
    t.boolean "edited"
    t.bigint "gossip_account_id"
    t.bigint "comment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_replys_on_comment_id"
    t.index ["gossip_account_id"], name: "index_replys_on_gossip_account_id"
  end

  create_table "topic_votes", force: :cascade do |t|
    t.boolean "upvote"
    t.bigint "gossip_account_id"
    t.bigint "topic_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gossip_account_id"], name: "index_topic_votes_on_gossip_account_id"
    t.index ["topic_id"], name: "index_topic_votes_on_topic_id"
  end

  create_table "topics", force: :cascade do |t|
    t.string "topic_name"
    t.string "description"
    t.date "dateCreated"
    t.integer "upvote"
    t.integer "downvote"
    t.boolean "active"
    t.bigint "gossip_account_id"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_topics_on_category_id"
    t.index ["gossip_account_id"], name: "index_topics_on_gossip_account_id"
  end

end
