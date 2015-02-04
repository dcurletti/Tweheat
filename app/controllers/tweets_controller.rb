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

		tw_client.filter(track: "patriots") do |tweet|
			response.stream.write(tweet_event(tweet)) unless tweet.retweeted?
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

		tw_client.search("patriots", result_type: "recent") do |tweet|
			console.log(tweet)
		end

	end


	private

	def tweet_event tweet
		[ 'event: tweet', "data: #{JSON.dump(format_tweet(tweet))}" ].join("\n") + "\n\n"
	end

	def format_tweet tweet
		{ content: JSON.pretty_generate(tweet.to_h) }
	end


end
