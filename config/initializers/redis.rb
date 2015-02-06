require "redis_stream"


redis_auth = {:host => ENV['REDIS_HOST'], :port => ENV['REDIS_PORT']}

RedisStream.configure( redis_auth)

$redis_ping = Redis.new( redis_auth )
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