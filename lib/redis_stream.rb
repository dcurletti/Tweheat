module RedisStream

  def self.configure(uri)
  	@uri = uri
  	@redis = Redis.new(:url => @uri)
  end

  def self.new_redis_client
  	Redis.new(:url => @uri)
  end
    
  def self.publish_to_search_stream(search_topic, tweet)
  	data = JSON.dump(tweet)

    @redis.publish( search_topic, data )
  end

  def self.remove_search_stream id
    @redis.zrem( USER_LIST_KEY, id)
  end

end


