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
			@stream_thread = Thread.new do
				begin
					@tw_stream_client = TwitterPackage.new_streaming_client
				rescue
					raise "\n\nUnable to connect to Twitter::Streaming::Client"
				end
				world_bounds = "-180,-90,180,90"
				filter_bounds = "-125.7042450905,24.5322774415,-66.62109375,49.5537255135"
				search_topics = @search_topics.except("all_tweets").keys
				search_topic_list = search_topics.join(", ")

				@tw_stream_client.filter( locations: filter_bounds ) do |tw_obj|
					# TEMP: improve the coordinates filter
					if tw_obj.is_a? Twitter::Tweet and ( tw_obj.to_h[:coordinates] != nil or tw_obj.to_h[:place] )

						print "." if counter % 50 == 0
						counter += 1
		
						tweet = TwitterPackage::Tweet.new(tw_obj, "All Tweets").to_hash

						# @search_topics["all_tweets"].each do |user_token|
						RedisStream.publish_tweet( "All Tweets", tweet )
						# end

						# search_topics.each do |search_term|			
						# 	if tw_obj.full_text.downcase.match(search_term)
						# 		tweet[:search_term] = search_term
						# 		@search_topics[search_term].each do |user_token|
						# 			RedisStream.publish_tweet( search_term, tweet )
						# 		end									
						# 	end
						# end
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

						# case channel
						# when "new_user"
						# 	handle_new_user(msg) 
						# when "new_search"
						# 	handle_new_search(msg)  
						# # when "remove_user"
						# # 	handle_remove_user(msg)
						# # when "remove_search"
						# # 	# handle_remove_search
						# end

						# puts "\n\nTwitter worked received: message:: #{msg} from channel:: #{channel}"
						# puts "\n\nCurrently tracking: #{@search_topics}"
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
				# restart_stream
			end

			def handle_new_search(msg)
				msg = JSON.parse(msg)
				search_term = msg["search_topic"]
				data = { 
					search_term: search_term
				}
				user_token = msg["user_token"]
				
				@search_topics[search_term] << user_token
				# restart_stream 
				# delete_empty_searches
			end

			def handle_remove_user(user_token)
				@search_topics.each do |search_term, users|
					users.delete(user_token)
					# Remove search term if no users are subbed to it
					@search_topics.delete(search_term) if users.empty? && search_term != "all_tweets"
				end
				restart_stream
				"\n\nRemoved user #{user_token}"
			end

			def delete_empty_searches
				@search_topics.each do |search_term, users|
					@search_topics.delete(search_term) if users.empty? && search_term != "all_tweets"
				end
			end
	end
end
