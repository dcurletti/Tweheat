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

			counter = 0
			# Open new stream
			# EM.run do
			@stream_thread = Thread.new do
				begin
					@tw_stream_client = TwitterPackage.new_streaming_client
				rescue
					raise "\n\nUnable to connect to Twitter::Streaming::Client"
				end

				world_bounds = "-180,-90,180,90"
				usa_bounds = "-125.7042450905,24.5322774415,-66.62109375,49.5537255135"
				search_topics = @search_topics.except("All Tweets").keys
				search_topic_list = search_topics.join(", ")
				puts "\n\non The right path"
				@tw_stream_client.filter( filter: search_topic_list, locations: world_bounds ) do |tw_obj|
					if tw_obj.is_a? Twitter::Tweet and ( tw_obj.to_h[:coordinates] != nil or tw_obj.to_h[:place] )

						print "." if counter % 50 == 0
						counter += 1

						tweet = TwitterPackage::Tweet.new(tw_obj, "All Tweets").to_hash

						WebsocketRails["All Tweets"].trigger 'newTweet', tweet

						search_topics.each do |search_term|			
							if tw_obj.full_text.downcase.match(search_term)
								tweet[:search_term] = search_term
								WebsocketRails[search_term].trigger 'newTweet', tweet
							end
						end
					end
				end
			# end
		end

		end

		def new
			puts "\n\nCreating Twitter Stream Worker"

			# TEMP: Hacky- These subscription values should be saved to Redis
			# Used to keep track of whom is connected and search terms
			@search_topics = Hash.new { |hash,key| hash[key] = Set.new }
			@search_topics["All Tweets"] = Set.new

			# Create this so that new relic doesn't constantly restart the Twitter Stream
			# which would then cause the API to timeout this app
			@disconnected_users = Set.new

			restart_stream
			# EventMachine.run do 
				@redis_thread = Thread.new do
					puts "\n\nOpened a thread inside of new"

					@redis_sub = RedisStream.new_redis_client
					subs = ["new_search", "remove_user"]

					@redis_sub.subscribe( subs ) do |on|
						on.message do |channel, msg|
							case channel
							when "new_search"
								handle_new_search(msg)  
							when "remove_user"
								handle_remove_user(msg)
							end

							puts "\n\nTwitter worker received: message:: #{msg} from channel:: #{channel}"
							puts "\n\nCurrently tracking: #{@search_topics}"
							puts "\n\nQueued disconnected_users: #{@disconnected_users.inspect}"
						end
					end
				# end	
			end
		end

		def close
			@redis_thread.kill if @redis_thread
			@stream_thread.kill if @stream_thread
			puts "\n\nKilling TwitterStream"
		end

		private

			def handle_new_search(msg)
				msg = JSON.parse(msg)
				search_term = msg["search_topic"]
				user_token = msg["user_token"]
				
				@search_topics[search_term] << user_token
				# delete_empty_searches
				restart_stream 
			end

			def handle_remove_user(user_token)
				@disconnected_users << user_token
			end

			def delete_empty_searches
				# Refactor this
				@disconnected_users.each do |user_token|
					@search_topics.each do |search_term, users|
						users.delete(user_token)
						@search_topics.delete(search_term) if users.empty? && search_term != "All Tweets"
					end
				end
				@disconnected_users = Set.new
			end
	end
end
