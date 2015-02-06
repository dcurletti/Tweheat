module RedisStream

  def self.configure(uri)
  	@uri = uri
  	@redis = Redis.new(:url => @uri)
  end

  def self.new_redis_client
  	Redis.new(:url => @uri)
  end
    
  def self.publish_to_user_stream(id, tweet)
  	data = JSON.dump(tweet)

    @redis.publish( id, data )
  end

  def self.remove_search_stream id
    @redis.zrem( USER_LIST_KEY, id)
  end

end


