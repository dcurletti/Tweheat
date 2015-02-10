require "twitter_package"

class TweetsController < ApplicationController

	before_filter :require_session_token!
	# Websocket connection with client
	include ActionController::Live

	def index
		# Gives connected user a session token for redis pub/sub
		# puts "WELCOME #{token}"
		check_in
	end

	def stream
		response.headers['Content-Type'] = 'text/event-stream'
		@redis_sub = RedisStream.new_redis_client

		puts "\n\nConnecting user #{token} to twitter stream..."
		counter = 0
		channel = token
		# Subscribing to user's stream by session token
		@redis_sub.subscribe([ token ]) do |on|
			on.message do |channel, msg|
				data = JSON.parse(msg)

				print "*" if counter % 50 == 0
				counter += 1

				if data['event'] == "layer"
					message = handle_new_layer(data)
				else
					message = handle_tweet(data)
				end
				
				# puts message unless data['data']['search_term'] == "All Tweets"

				response.stream.write(message)
			end
		end

	rescue IOError
		"\n\nIOError in controller"
	rescue ClientDisconnected
		puts "\n\nClient has disconnected\n\n"
	ensure
		puts "\n\nClosing stream, Redis Sub and removing #{token}\n\n"
		@redis_sub.quit
		# RedisStream.publish_remove_user(token)
		response.stream.close
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

		def handle_tweet msg
			event = msg['data']['search_term']
			data = JSON.dump(msg['data'])
			compile_SSE(event, data)
		end

		def handle_new_layer msg
			compile_SSE("layer", JSON.dump(msg["data"]))
		end

		def compile_SSE event, data
			[ "event: #{event}", "data: #{data}" ].join("\n") + "\n\n"
		end

end
