Rails.application.routes.draw do
  root "pages#index"

  namespace :api do
    resources :gossip_account do 
      member do
        post '/create_account' => 'gossip_account#createAccount'
        post '/authenticate_account' => 'gossip_account#authenticateAccount'
      end
    end

    resources :category do
      member do
        post '/create_category' => 'category#createCategory'
        post '/fetch_categories' => 'category#fetchCategories'
        post '/fetch_communities' => 'category#fetchCommunities'
        post '/create_community' => 'category#createCommunity'
        post '/fetch_topics' => 'category#fetchTopics'
        post '/create_topic' => 'category#createTopic'
        post '/upvote' => 'category#upvoteCategory'
        post '/downvote' => 'category#downvoteCategory'
        post '/delete_category' => 'category#deleteCategory'
      end
    end

    resources :community do
      member do
        post '/create_community' => 'community#createCommunity'
        post '/check_community_limit' => 'community#checkCommunityLimit'
        post '/fetch_communities' => 'community#fetchCommunities'
        post '/fetch_topics' => 'community#fetchTopics'
        post '/create_topic' => 'community#createTopic'
        post '/upvote' => 'community#upvoteCommunity'
        post '/downvote' => 'community#downvoteCommunity'
        post '/edit_community' => 'community#editCommunity'
        post '/delete_community' => 'community#deleteCommunity'
      end
    end

    resources :topic do
      member do
        post '/create_topic' => 'topic#createTopic'
        post '/check_topic_limit' => 'topic#checkTopicLimit'
        post '/fetch_topics' => 'topic#fetchTopics'
        post '/upvote' => 'topic#upvoteTopic'
        post '/downvote' => 'topic#downvoteTopic'
        post '/edit_topic' => 'topic#editTopic'
        post '/delete_topic' => 'topic#deleteTopic'
      end
    end

    resources :topic_vote do
      member do
        post '/check_vote' => 'topic_vote#checkVote'
      end
    end

    resources :category_vote do
      member do
        post '/check_vote' => 'category_vote#checkVote'
      end
    end

    resources :community_vote do
      member do
        post '/check_vote' => 'community_vote#checkVote'
      end
    end

    resources :comment_vote do
      member do
        post '/check_vote' => 'comment_vote#checkVote'
      end
    end

    resources :reply_vote do
      member do
        post '/check_vote' => 'reply_vote#checkVote'
      end
    end

    resources :comment do
      member do
        post '/fetch_comments' => 'comment#fetchComments'
        post '/create_comment' => 'comment#createComment'
        post '/edit_comment' => 'comment#editComment'
        post '/upvote' => 'comment#upvoteComment'
        post '/downvote' => 'comment#downvoteComment'
      end
    end

    resources :reply do 
      member do
        get '/fetch_replys' => 'reply#fetchReplys'
        post '/create_reply' => 'reply#createReply'
        post '/edit_reply' => 'reply#editReply'
        post '/upvote' => 'reply#upvoteReply'
        post '/downvote' => 'reply#downvoteReply'
      end
    end

    resources :pinned_category do 
      member do
        post '/fetch_categories' => 'pinned_category#fetchCategories'
        post '/check_save' => 'pinned_category#checkSave'
        post '/save_category' => 'pinned_category#saveCategory'
      end
    end

    resources :pinned_community do 
      member do
        post '/fetch_communities' => 'pinned_community#fetchCommunities'
        post '/check_save' => 'pinned_community#checkSave'
        post '/save_community' => 'pinned_community#saveCommunity'
      end
    end

    resources :pinned_topic do 
      member do
        post '/fetch_topics' => 'pinned_topic#fetchTopics'
        post '/check_save' => 'pinned_topic#checkSave'
        post '/save_topic' => 'pinned_topic#saveTopic'
      end
    end

    resources :notification do 
      member do
        post '/fetch_notifications' => 'notification#fetchNotifications'
        post '/delete_notification' => 'notification#deleteNotification'
      end
    end
  end

  get '*path', to: 'pages#index', via: :all
end
