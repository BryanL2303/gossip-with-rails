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
        post '/fetch_topics' => 'category#fetchTopics'
        post '/create_topic' => 'category#createTopic'
        post '/upvote' => 'category#upvoteCategory'
        post '/downvote' => 'category#downvoteCategory'
        post '/open_category' => 'category#openCategory'
        post '/close_category' => 'category#closeCategory'
        post '/delete_category' => 'category#deleteCategory'
        get '/fix' => 'category#activateAll'
      end
    end

    resources :category_vote do
      member do
        post '/check_vote' => 'category_vote#checkVote'
      end
    end

    resources :topic do
      member do
        post '/create_topic' => 'topic#createTopic'
        get '/fetch_topics' => 'topic#fetchTopics'
        post '/upvote' => 'topic#upvoteTopic'
        post '/downvote' => 'topic#downvoteTopic'
        post '/close_topic' => 'topic#closeTopic'
        post '/open_topic' => 'topic#openTopic'
        post '/delete_topic' => 'topic#deleteTopic'
      end
    end

    resources :topic_vote do
      member do
        post '/check_vote' => 'topic_vote#checkVote'
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

    resources :favourite do 
      member do
        post '/fetch_topics' => 'favourite#fetchTopics'
        post '/check_save' => 'favourite#checkSave'
        post '/save_topic' => 'favourite#saveTopic'
      end
    end

    resources :notification do 
      member do
        post '/create_notification' => 'notification#createNotification'
        post '/fetch_notifications' => 'notification#fetchNotifications'
        post '/delete_notification' => 'notification#deleteNotification'
      end
    end
  end

  get '*path', to: 'pages#index', via: :all
end
