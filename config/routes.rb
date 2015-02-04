Rails.application.routes.draw do


  resource :tweets do
  	collection { get :stream }
  end
  
  get 'tweets', to: 'tweets#show' 
  # resources :tweets, only: [:show]
  root to: "tweets#index"
end
