module RedisStream

  def self.configure(uri)
  	@uri = uri
  	@redis = Redis.new(:url => @uri)
  end

  def self.new_redis_client
  	Redis.new(:url => @uri)
  end

  def self.publish_new_user(user_token)
    @redis.publish("new_user", user_token)
  end
    
  def self.publish_to_search_stream(search_topic, tweet)
  	data = JSON.dump(tweet)

    @redis.publish( search_topic, data )
  end

  def self.sub_to_search_stream(search_topic, user_token)
    data = JSON.dump({ 
      :search_topic => search_topic,
      :user_token => user_token
    })
    @redis.publish( "new_search", data )
  end

  def self.publish_new_search_layer(search_topic, user_token)
    data = JSON.dump({
      :event => "layer",
      :search_term => search_topic
    })
    @redis.publish( user_token, data )
  end

  # def self.remove_search_stream id
  #   @redis.zrem( USER_LIST_KEY, id)
  # end

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