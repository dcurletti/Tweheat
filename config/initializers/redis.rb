require "redis_stream"

#TEMP: Add in environment variables later on
redis_auth = {:host => ENV['REDIS_HOST'], :port => ENV['REDIS_PORT']}

RedisStream.configure()

$redis_ping = Redis.new
ping_thread = Thread.new do
	while true
		$redis_ping.publish("ping", "pong")
		sleep 20.seconds
	end
end

at_exit do
	ping_thread.kill
	$redis_ping.quit
end