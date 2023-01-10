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

ActiveRecord::Schema[7.0].define(version: 2023_01_08_104703) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "category_name"
    t.string "category_description"
    t.integer "upvote"
    t.integer "downvote"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "category_tags", force: :cascade do |t|
    t.bigint "category_id"
    t.bigint "community_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_category_tags_on_category_id"
    t.index ["community_id"], name: "index_category_tags_on_community_id"
  end

  create_table "category_votes", force: :cascade do |t|
    t.boolean "upvote"
    t.bigint "gossip_account_id"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_category_votes_on_category_id"
    t.index ["gossip_account_id"], name: "index_category_votes_on_gossip_account_id"
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

  create_table "communities", force: :cascade do |t|
    t.string "community_name"
    t.string "community_description"
    t.integer "upvote"
    t.integer "downvote"
    t.bigint "gossip_account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gossip_account_id"], name: "index_communities_on_gossip_account_id"
  end

  create_table "community_votes", force: :cascade do |t|
    t.boolean "upvote"
    t.bigint "gossip_account_id"
    t.bigint "community_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_community_votes_on_community_id"
    t.index ["gossip_account_id"], name: "index_community_votes_on_gossip_account_id"
  end

  create_table "gossip_accounts", force: :cascade do |t|
    t.string "account_name"
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.string "message"
    t.bigint "gossip_account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "topic_id"
    t.bigint "comment_id"
    t.bigint "reply_id"
    t.string "tag"
    t.index ["comment_id"], name: "index_notifications_on_comment_id"
    t.index ["gossip_account_id"], name: "index_notifications_on_gossip_account_id"
    t.index ["reply_id"], name: "index_notifications_on_reply_id"
    t.index ["topic_id"], name: "index_notifications_on_topic_id"
  end

  create_table "pinned_categories", force: :cascade do |t|
    t.bigint "gossip_account_id"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_pinned_categories_on_category_id"
    t.index ["gossip_account_id"], name: "index_pinned_categories_on_gossip_account_id"
  end

  create_table "pinned_communities", force: :cascade do |t|
    t.bigint "gossip_account_id"
    t.bigint "community_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_pinned_communities_on_community_id"
    t.index ["gossip_account_id"], name: "index_pinned_communities_on_gossip_account_id"
  end

  create_table "pinned_topics", force: :cascade do |t|
    t.bigint "gossip_account_id"
    t.bigint "topic_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gossip_account_id"], name: "index_pinned_topics_on_gossip_account_id"
    t.index ["topic_id"], name: "index_pinned_topics_on_topic_id"
  end

  create_table "replies", force: :cascade do |t|
    t.string "reply"
    t.integer "upvote"
    t.integer "downvote"
    t.boolean "edited"
    t.bigint "gossip_account_id"
    t.bigint "comment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_replies_on_comment_id"
    t.index ["gossip_account_id"], name: "index_replies_on_gossip_account_id"
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

  create_table "topic_category_tags", force: :cascade do |t|
    t.bigint "category_id"
    t.bigint "topic_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_topic_category_tags_on_category_id"
    t.index ["topic_id"], name: "index_topic_category_tags_on_topic_id"
  end

  create_table "topic_community_tags", force: :cascade do |t|
    t.bigint "topic_id"
    t.bigint "community_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_topic_community_tags_on_community_id"
    t.index ["topic_id"], name: "index_topic_community_tags_on_topic_id"
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
    t.string "topic_description"
    t.integer "upvote"
    t.integer "downvote"
    t.boolean "active"
    t.bigint "gossip_account_id"
    t.bigint "community_id"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_topics_on_category_id"
    t.index ["community_id"], name: "index_topics_on_community_id"
    t.index ["gossip_account_id"], name: "index_topics_on_gossip_account_id"
  end

end
