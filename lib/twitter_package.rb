module TwitterPackage

	def self.configure(config = {})
		@config = config
	end

	class Tweet
		attr_accessor(:user_name, :coordinates)

		def initialize(tw_obj)
			tw_hash = tw_obj.to_h
			@tweet = {
				:user_name => tw_hash[:user][:name],
				:coordinates => tw_hash[:coordinates][:coordinates]
			}
			@tweet.each do |name, value|
				send("#{name}=", value)
			end
		end

		def to_hash
			hash = {}
			instance_variables.each { |var| hash[var.to_s.delete("@")]	= instance_variable_get(var) }
			hash["tweet"]
		end
	end

	def self.new_streaming_client
		Twitter::Streaming::Client.new(@config)
	end

	def self.new_rest_client
		Twitter::REST::Client.new(@config)
	end

end