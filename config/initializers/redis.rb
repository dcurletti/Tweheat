require "redis_stream"

#TEMP: Add in environment variables later on
uri = URI.parse(ENV["REDISCLOUD_URL"])

RedisStream.configure(uri)