class TweetsController < ApplicationController

	# Used in place of WebSockets- Opens a continuous HTTP connection 
	# with the client
	include ActionController::Live

	def index
		
	end

	def stream
		response.headers['Content-Type'] = 'text/event-stream'

		tw_client = Twitter::Streaming::Client.new do |config|
			  config.consumer_key        = ENV["twitter_consumer_key"]
			  config.consumer_secret     = ENV["twitter_consumer_secret"]
			  config.access_token        = ENV["twitter_access_token"]
			  config.access_token_secret = ENV["twitter_access_token_secret"]
		end

		# USA Bounding Box: [[[-124.62890625,23.8858376999],[-124.62890625,49.5537255135],[-66.62109375,49.5537255135],[-66.62109375,23.8858376999],[-124.62890625,23.8858376999]]]

		filter_bounds = "-125.7042450905,24.5322774415,-66.62109375,49.5537255135"

		tw_client.filter(locations: filter_bounds) do |tw_obj|
			if tw_obj.is_a? Twitter::Tweet
				tweet = tw_obj.to_h
				response.stream.write(tweet_event(tweet)) if tweet[:coordinates]
			end
		end

	ensure
		response.stream.close
	end

	def show
		tw_client = Twitter::REST::Client.new do |config|
			  config.consumer_key        = ENV["twitter_consumer_key"]
			  config.consumer_secret     = ENV["twitter_consumer_secret"]
			  config.access_token        = ENV["twitter_access_token"]
			  config.access_token_secret = ENV["twitter_access_token_secret"]
		end

		# tweet = tw_client.search("hipster", { geocode: "37.781157,-122.398720,1mi" }).take(5)

		places = tw_client.trends(23424977)
		
		puts places

		render json: places.to_h
	end

	def trends


		
	end


	private

		def tweet_event tweet
			[ 'event: tweet', "data: #{JSON.dump(format_tweet(tweet))}" ].join("\n") + "\n\n"
		end

		def format_tweet tweet
			{ content: tweet[:user][:name],
				coordinates: tweet[:coordinates][:coordinates]
			 }
		end

end
