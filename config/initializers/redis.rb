require "redis_stream"

#TEMP: Add in environment variables later on
redis_auth = {:host => ENV['REDIS_HOST'], :port => ENV['REDIS_PORT']}

RedisStream.configure()