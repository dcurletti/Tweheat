Rails.application.routes.draw do


  resource :tweets do
  end
  
  get 'tweets', to: 'tweets#show'
  get 'tweets/search', to: 'tweets#search'
  # resources :tweets, only: [:show]
  root to: "tweets#index"
end
