module RedisStream

	USER_HASH_KEY_BASE = "Tweheat" + ':users:'
  USER_LIST_KEY = "Tweheat" + ':users'

  USER_STREAM_MSG_CHANNEL_BASE = "Tweheat" + ":streams:msg:"
  USER_STREAM_NEW_CHANNEL = "Tweheat" + ":streams:new_user"

  USER_STREAM_EXPIRES = 1.day.to_f

  def self.configure(config = {})
  	@redis = Redis.new
  end

  def self.new_redis_client
  	Redis.new
  end

  def self.get_user_hash_key(id)
    USER_HASH_KEY_BASE + id.to_s
  end

  def self.get_user_subscription_key(id)
    USER_STREAM_MSG_CHANNEL_BASE + id.to_s
  end

  # Users stored as hashes with keys like APP:users:[userID]
  def self.get_user_hash(id, *fields)
    #@user = @redis.hgetall( _get_user_hash_key( id ) )
    @user = @redis.mapped_hmget( self.get_user_hash_key( id ), *fields )

    # Transform keys from Strings to Symbols
    @user.symbolize_keys if @user
  end

    # Users stored as hashes with keys like APP:users:[userID]
  def self.get_user_hash(id, *fields)
    #@user = @redis.hgetall( _get_user_hash_key( id ) )
    @user = @redis.mapped_hmget( self.get_user_hash_key( id ), *fields )

    # Transform keys from Strings to Symbols
    @user.symbolize_keys if @user
  end

    # Publish this user add so the Twitter Stream will pick up this user's ID
  def self.add_user_stream(id)
    puts "RedisStreamBroker: Adding new user stream: #{id.to_s}"
    @redis.zadd( USER_LIST_KEY, Time.now.to_f, id)
    @redis.publish( USER_STREAM_NEW_CHANNEL,  id.to_s)
  end
    
  def self.publish_to_user_stream(id, tweet)
  	data = JSON.dump(tweet)
  	# puts data

    @redis.publish( id, data )
    # puts "tweet is a: #{tweet.class}"
    # puts "PUBLISHED\n\n\n\n\n"
  end

  def self.remove_user_stream id
    @redis.zrem( USER_LIST_KEY, id)
  end

      def self._sanitize(message)
        json = JSON.dump(message)
        # json.each {|key, value| json[key] = ERB::Util.html_escape(value) }
        # JSON.generate(json)
        return json
      end

end


