class SocketsController < WebsocketRails::BaseController

	def user_connected
		# broadcast_message :new_message, {:user => current_user.screen_name, :text => message[:text]}
		"#{token} connected"
	end

	def incoming_message
		p "Received message"
		p token
	end

	def client_disconnected
		p "Hit the client disconnect"
		# RedisStream.publish_remove_user(token)
		connection.disconnect!
	end

end