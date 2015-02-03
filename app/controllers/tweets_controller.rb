class TweetsController < ApplicationController

	# Used in place of WebSockets- Opens a continuous HTTP connection 
	# with the client
	include ActionController::Live

	def index
		
	end

	def stream
		response.headers['Content-Type'] = 'text/event-stream'

		tw_client = Twitter::Streaming::Client.new do |config|
			  config.consumer_key        = twitter_consumer_key
			  config.consumer_secret     = twitter_consumer_secret
			  config.access_token        = twitter_access_token
			  config.access_token_secret = twitter_access_token_secret
		end

		client.filter(track: "patriots") do |tweet|
			response.stream.write(tweet_event(tweet)) unless tweet.retweeted?
		end

	ensure
		response.stream.close
	end

	def show
		
	end


	private

	def tweet_event tweet
		[ 'event: tweet', "data: #{JSON.dump(format_tweet(tweet))}" ].join("\n") + "\n\n"
	end

	def format_tweet tweet
		{ content: tweet.full_text }
	end


end
