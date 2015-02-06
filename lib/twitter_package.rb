module TwitterPackage

	def self.configure(config = {})
		@config = config
	end

	def self.new_streaming_client
		Twitter::Streaming::Client.new(@config)
	end

	def self.new_rest_client
		Twitter::REST::Client.new(@config)
	end

end