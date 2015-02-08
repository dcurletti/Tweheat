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
    
  def self.sub_to_search_stream(search_topic, user_token)
    data = JSON.dump({ 
      :search_topic => search_topic,
      :user_token => user_token
    })
    @redis.publish( "new_search", data )
  end

  def self.publish_to_search_stream(user_token, tweet)
  	data = JSON.dump(tweet)

    @redis.publish( user_token, data )
  end

  def self.publish_to_user_stream(event, data, user_token)
    json_data = JSON.dump({
      :event => event,
      :data => data
    })
    @redis.publish( user_token, json_data )
  end

  def method_name
    
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