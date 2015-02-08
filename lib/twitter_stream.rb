require 'twitter_package'
require 'redis_stream'
require 'json'
require 'set'

class TwitterStream
	class << self
		def initialize (config = {})
			puts "\n\nTwitter Stream initialized"
		end

		def restart_stream
			puts "\n\nRestarting Twitter Stream"
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
					if tw_obj.is_a? Twitter::Tweet and tw_obj.to_h[:coordinates] != nil

						# Use custom Twitter class to strip it of unnecessary attrs
						tweet = TwitterPackage::Tweet.new(tw_obj).to_hash

						# puts tweet.to_hash
						RedisStream.publish_to_search_stream( "all_tweets", tweet)
					end
				end
			end
		end

		def new
			puts "\n\nCreating Twitter Stream Worker"

			# TEMP: Hacky- These subscription values should be saved to Redis
			# Used to keep track of whom is connected and search terms
			@search_topics = Hash.new { |hash,key| hash[key] = Set.new }
			@search_topics["all_tweets"] = Set.new

			restart_stream

			@redis_thread = Thread.new do
				puts "\n\nOpened a thread inside of new"

				@redis_sub = RedisStream.new_redis_client
				subs = ["new_search", "new_user", "remove_search", "remove_user"]

				@redis_sub.subscribe( subs ) do |on|
					on.message do |channel, msg|

						case channel
						when "new_user"
							handle_new_user(msg) 
						when "new_search"
							handle_new_search(msg)  
						when "remove_user"
							# handle_remove_user(msg)
							puts "\n\nTwitter Stream: Should remove user"
						when "remove_search"
							handle_remove_search
						end

						puts "\n\nReceived message:: #{msg} from channel:: #{channel}"
						puts "\n\nCurrently tracking: #{@search_topics}"
					end
				end
			end	
		end

		def close
			@redis_thread.kill if @redis_thread
			@stream_thread.kill if @stream_thread
			puts "\n\nKilling TwitterStream"
		end

		private

			def handle_new_user(user_token)
				@search_topics["all_tweets"] << user_token

			end

			def handle_new_search(msg)
				data = JSON.parse(msg)
				search_topic = data["search_topic"]
				user_token = data["user_token"]
				
				@search_topics[search_topic] << user_token

				RedisStream.publish_new_search_layer(search_topic, user_token)
				puts "published new layer stream"

				# TEMP: Shouldn't restart stream if search_topic already exists
				restart_stream
			end

			def handle_remove_user(msg)
				@search_topics.values.each do |set|
					puts set
					set.delete(msg)
				end

				restart_stream
			end


	end
end