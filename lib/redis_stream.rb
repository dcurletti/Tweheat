module RedisStream

  def self.configure(uri)
  	@uri = uri
  	@redis = Redis.new(:url => @uri)
  end

  def self.new_redis_client
  	Redis.new(:url => @uri)
    # , :driver => :hiredis
  end

  def self.publish_new_user(user_token)
    @redis.publish("new_user", user_token)
  end
    
  def self.sub_to_search_stream(search_topic, user_token)
    data = JSON.dump({ 
      :search_topic => search_topic,
      :user_token => user_token
    })
    @redis.publish( "new_search", data )
  end

  def self.publish_tweet( search_term, data, user_token=nil )
    # params = JSON.dump(data)
    json_data = JSON.dump({
      search_term: search_term,
      data: data
    })
    @redis.publish( "All Tweets", json_data )
    # @redis.publish( "all_tweets", json_data )
  end

  def self.publish_remove_user(user_token)  
    @redis.publish( "remove_user", user_token )
  end

end

# {
#   event: "tweet",
#   data: {
#     coordinates: []
#   }
# }

# {
#   event: "layer",
#   data: {
#     search_term: ""
#   }
# }