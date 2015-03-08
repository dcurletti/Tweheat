class SocketsController < WebsocketRails::BaseController

	def user_connected

		# @redis_sub.quit
		# RedisStream.publish_remove_user(token)


		# broadcast_message :new_message, {:user => current_user.screen_name, :text => message[:text]}
	end

	def client_disconnected
		# debugger
		p "\n\nLETS RIDE"
		# @redis_sub.quit
		# connection.disconnect!
		# @thread.kill
	end

	def incoming_message(test)
		p "Received message"
		trigger_success "meow"
	end

	def client_disconnected
		p "Hit the client disconnect"
		# Thread.exit(@thread)
		@redis_sub.unsubscribe
		connection.disconnect!
	end

end