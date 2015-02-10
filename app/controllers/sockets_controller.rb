class ChatController < WebsocketRails::BaseController

	def user_connected
		p "\n\nuser connected"
		# send_message :user_info, {:user => current_user.screen_name}
	end

	def incoming_message
		puts "\n\nwhat????"
		@redis_sub = RedisStream.new_redis_client

		puts "\n\nConnecting user #{token} to twitter stream..."
		counter = 0
		channel = token
		# Subscribing to user's stream by session token
		@thread = Thread.new do
			@redis_sub.subscribe([ "all_tweets" ]) do |on|
				on.message do |channel, msg|
					data = JSON.parse(msg)

					print "*" if counter % 50 == 0
					counter += 1

					# if data['event'] == "layer"
					# 	message = handle_new_layer(data)
					# else
					# 	message = handle_tweet(data)
					# end
					
					# puts message unless data['data']['search_term'] == "All Tweets"
					# broadcast_message :all_tweets, message

					debugger
				end
			end
		end

	rescue IOError
		"\n\nIOError in controller"
	rescue ClientDisconnected
		puts "\n\nClient has disconnected\n\n"
	ensure
		puts "\n\nClosing stream, Redis Sub and removing #{token}\n\n"
		# @redis_sub.quit
		# RedisStream.publish_remove_user(token)


		# broadcast_message :new_message, {:user => current_user.screen_name, :text => message[:text]}
	end

	def user_disconnected
		p "\n\nuser disconnected"
	end

end