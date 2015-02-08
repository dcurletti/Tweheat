Rails.application.routes.draw do


  resource :tweets do
  	collection { get :stream }
  end
  
  get 'tweets', to: 'tweets#show'
  get 'tweets/search', to: 'tweets#search'
  # resources :tweets, only: [:show]
  root to: "tweets#index"
end
