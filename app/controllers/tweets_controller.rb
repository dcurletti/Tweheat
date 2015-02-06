require "twitter_package"

class TweetsController < ApplicationController

	# Used in place of WebSockets- Opens a continuous HTTP connection 
	# with the client
	include ActionController::Live

	def index
		
	end

	def stream
		
		response.headers['Content-Type'] = 'text/event-stream'

		puts "\n\nInitializing Tweet stream-"

		@redis_sub = RedisStream.new_redis_client

		sub_key = "all_tweets"

		@redis_sub.subscribe([ sub_key, 'ping']) do |on|
			on.message do |channel, msg|
				msg = JSON.parse(msg)
				puts "Writing to client: channel:: #{channel}, msg:: #{msg.class}"
				# response.stream.write(tweet_event(msg)) if msg[:coordinates]
				# puts tweet[:user][:name]				
			end
		end

	rescue ClientDisconnected

		puts "\n\nClient has disconnected\n\n"

	ensure
		puts "\n\nClosing stream and Redis Sub\n\n"
		@redis_sub.quit
		response.stream.close
	end

	def show

		tw_client = TwitterPackage.new_rest_client

		places = tw_client.trends(23424977)
		
		puts places

		render json: places.to_h
	end


	private

		def tweet_event tweet
			[ 'event: tweet', "data: #{JSON.dump(format_tweet(tweet))}" ].join("\n") + "\n\n"
		end

		def format_tweet tweet
			{ 
				username: tweet[:user][:name],
				coordinates: tweet[:coordinates][:coordinates]
			 }
		end

end
