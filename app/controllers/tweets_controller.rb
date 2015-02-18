require "twitter_package"

class TweetsController < ApplicationController
	include Tubesock::Hijack

	before_filter :require_session_token!
	# Websocket connection with client
	# include ActionController::Live

	def index
		# Gives connected user a session token for redis pub/sub
		# puts "WELCOME #{token}"
		check_in

	end

	def stream
		hijack do |tubesock|
			@redis_thread = Thread.new do 
				@redis_sub = RedisStream.new_redis_client

				puts "\n\nConnecting user #{token} to twitter stream..."
				counter = 0
				channel = "All Tweets"
				
				@redis_sub.subscribe([ channel ]) do |on|
					on.message do |channel, msg|
						data = JSON.parse(msg)

						print "*" if counter % 50 == 0
						counter += 1

						tubesock.send_data msg

						# if data['event'] == "layer"
						# 	message = handle_new_layer(data)
						# else
						# 	message = handle_tweet(data)
						# end
						
						# puts message unless data['data']['search_term'] == "All Tweets"

						# response.stream.write(message)
					end
				end
			end

			tubesock.onmessage do |msg|
				puts "Received a message"
			end

			tubesock.onclose do |msg|
				puts "\n\nClosing stream, Redis Sub and removing #{token}\n\n"
				@redis_thread.kill
				RedisStream.publish_remove_user(token)
			end
			
		# end

	# rescue IOError
	# 	"\n\nIOError in controller"
	# rescue ClientDisconnected
	# 	puts "\n\nClient has disconnected\n\n"
	# ensure
	# 	puts "\n\nClosing stream, Redis Sub and removing #{token}\n\n"
		# @redis_sub.quit
		# @redis_thread.exit
		# RedisStream.publish_remove_user(token)
		# response.stream.close
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

end
