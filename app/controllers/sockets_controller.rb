class ChatController < WebsocketRails::BaseController

	def user_connected
		p "\n\nuser connected"
		# send_message :user_info, {:user => current_user.screen_name}
	end

	def incoming_message
		puts "\n\nwhat????"
		# broadcast_message :new_message, {:user => current_user.screen_name, :text => message[:text]}
	end

	def user_disconnected
		p "\n\nuser disconnected"
	end

end