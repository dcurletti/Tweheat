require "twitter_package"

class TweetsController < ApplicationController

	before_filter :require_session_token!
	# Websocket connection with client
	include ActionController::Live

	def index
		# Gives connected user a session token for redis pub/sub
		check_in
	end

	def stream
		response.headers['Content-Type'] = 'text/event-stream'
		@redis_sub = RedisStream.new_redis_client

		puts "\n\nConnecting user #{token} to twitter stream..."

		# A user's token is what defines what search terms the server will push
		# to his/her stream
		sub_key = token

		# Subscribing to user's stream  
		@redis_sub.subscribe([ sub_key ]) do |on|
			on.message do |channel, msg|
				data = JSON.parse(msg)

				response.stream.write(tweet_event(data))
				puts "Stream sub here: #{msg}"
			end
		end

	rescue ClientDisconnected
		puts "\n\nClient has disconnected\n\n"
	ensure
		puts "\n\nClosing stream and Redis Sub\n\n"
		@redis_sub.quit
		response.stream.close
		# Method here for removing the user's session token from the twitter streamer
	end

	def search
		## How to get the search item
		# Look up sending the form through jquery
		search_term = params[:search_term]
		
		RedisStream.sub_to_search_stream( search_term, token )

		test = { hello: "good job" }

		# To allow for success callback from fetch
		respond_to do |format|
			format.json { render json: test }
		end
	end

	def show
		tw_client = TwitterPackage.new_rest_client

		places = tw_client.trends(23424977)
		
		puts places

		render json: places.to_h
	end

	private

		def tweet_event tweet
			[ 'event: layer', "data: #{JSON.dump(format_tweet(tweet))}" ].join("\n") + "\n\n"
		end

		def format_tweet tweet
			# { 
			# 	username: tweet["user_name"],
			# 	coordinates: tweet["coordinates"]
		 	# }
			 {
				search_term: tweet["search_term"]
			 }
		end

end
