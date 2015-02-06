module RedisStream

	USER_HASH_KEY_BASE = "Tweheat" + ':users:'
  USER_LIST_KEY = "Tweheat" + ':users'

  USER_STREAM_MSG_CHANNEL_BASE = "Tweheat" + ":streams:msg:"
  USER_STREAM_NEW_CHANNEL = "Tweheat" + ":streams:new_user"

  USER_STREAM_EXPIRES = 1.day.to_f

  def self.configure(config = {})
  	@config = config
  	@redis = Redis.new config
  end

  def self.new_redis_client
  	Redis.new config
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
    @redis.publish( USER_STREAM_MSG_CHANNEL_BASE + id, tweet.to_json)
  end

  def self.remove_user_stream id
    @redis.zrem( USER_LIST_KEY, id)
  end

  private

      def self._sanitize(message)
        json = JSON.parse(message)
        json.each {|key, value| json[key] = ERB::Util.html_escape(value) }
        JSON.generate(json)
      end

end


