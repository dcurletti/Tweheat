Rails.application.routes.draw do
  root to: "tweets#index"


  resource :tweets do
  	collection { get :stream }
  end
  get 'tweets', to: 'tweets#show' 
  # resources :tweets, only: [:show]
end
