require "twitter_package"

class TweetsController < ApplicationController

	before_filter :require_session_token!
	# Used in place of WebSockets- Opens a continuous HTTP connection 
	# with the client
	include ActionController::Live

	def index
		# Gives connected user a session token for redis pub/sub
		check_in
	end

	def stream
		
		response.headers['Content-Type'] = 'text/event-stream'

		puts "\n\nInitializing Tweet stream---"

		@redis_sub = RedisStream.new_redis_client

		puts "Connecting user #{session[:session_token]} to his account..."

		sub_key = "all_tweets"

		# Subscribing to TwitterStream from StreamWorker
		@redis_sub.subscribe([ sub_key ]) do |on|
			on.message do |channel, msg|
				tweet = JSON.parse(msg)
				response.stream.write(tweet_event(tweet))
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

	def search
		@redis_pub = RedisStream.new_redis_client
		@redis_pub.publish( "new_search", "testing")
		puts "End of search"
		render nothing: true

	end

	private

		def tweet_event tweet
			[ 'event: tweet', "data: #{JSON.dump(format_tweet(tweet))}" ].join("\n") + "\n\n"
		end

		def format_tweet tweet
			{ 
				username: tweet["user_name"],
				coordinates: tweet["coordinates"]
			 }
		end

end
