require 'twitter_package'
require 'redis_stream'

class TwitterStreamWorker
	class << self
		def initialize (config = {})
			puts "\n\nStreamWorker initialized"
		end

		def restart_stream
			puts "\n\nRestarting Twitter stream"

			# Kills stream if there is one already
			@stream_thread.kill if @stream_thread

			# Open new stream
			@stream_thread = Thread.new do
				
				begin
					@tw_stream_client = TwitterPackage.new_streaming_client
				rescue
					raise "\n\nUnable to connect to Twitter::Streaming::Client"
				end

				filter_bounds = "-125.7042450905,24.5322774415,-66.62109375,49.5537255135"

				@tw_stream_client.filter(locations: filter_bounds) do |tw_obj|
					if tw_obj.is_a? Twitter::Tweet
						tweet = tw_obj.to_h

						# puts tweet[:user][:name]

						# puts tweet.class
						RedisStream.publish_to_user_stream( "all_tweets", tweet)
					end
				end
			end
		end

		def new
			puts "\n\nCreating Twitter Stream Worker"

			restart_stream

			@redis_thread = Thread.new do
				puts "\n\nOpened a test user thread inside of new"

				# @redis_sub = RedisStreamBroker.new_redis_client
				# @redis_sub.subscribe([ ])
			end	
		end

		def close
			@redis_thread.kill if @redis_thread
			@stream_thread if @stream_thread
			puts "\n\nKilling a TwitterStreamWorker"
		end

	end
end