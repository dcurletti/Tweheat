require "twitter_package"

class TweetsController < ApplicationController

	# Used in place of WebSockets- Opens a continuous HTTP connection 
	# with the client
	include ActionController::Live

	def index
		
	end

	def stream
		
		response.headers['Content-Type'] = 'text/event-stream'

		tw_client = TwitterPackage.new_streaming_client

		filter_bounds = "-125.7042450905,24.5322774415,-66.62109375,49.5537255135"

		tw_client.filter(locations: filter_bounds) do |tw_obj|
			if tw_obj.is_a? Twitter::Tweet
				tweet = tw_obj.to_h
				response.stream.write(tweet_event(tweet)) if tweet[:coordinates]
				puts tweet[:user][:name]
			end
		end

	rescue ClientDisconnected

		puts "\n\nClient has disconnected\n\n"

	ensure
		puts "\n\nClosing stream\n\n"
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
