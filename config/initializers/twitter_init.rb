# Starts the TwitterPackage module that contains the Twitter Clients
# Twitter Package 

require 'twitter_package'

TwitterPackage.configure({
  :consumer_key        => ENV["twitter_consumer_key"],
  :consumer_secret     => ENV["twitter_consumer_secret"],
  :access_token        => ENV["twitter_access_token"],
  :access_token_secret => ENV["twitter_access_token_secret"]
})

