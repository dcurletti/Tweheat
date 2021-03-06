module RedisStream

  def self.configure(uri)
  	@uri = uri
  	@redis = Redis.new(:url => @uri, :driver => :hiredis)
  end

  def self.new_redis_client
  	Redis.new(:url => @uri, :driver => :hiredis)
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

  def self.publish_remove_user(user_token)  
    @redis.publish( "remove_user", user_token )
  end

end

# {
#   search_term: "All Tweets",
#   data: {
#     search_term: search_term,
#     coordinates: [],
#     text: "text"
#   }
# }

# {
#   event: "layer",
#   data: {
#     search_term: ""
#   }
# }