module TwitterPackage

	def self.configure(config = {})
		@config = config
	end

	class Tweet
		attr_accessor :search_term, :coordinates

		def self.handle_coordinates(tw_hash)
			coordinates = tw_hash[:coordinates]
			return tw_hash[:coordinates][:coordinates] unless coordinates == nil

			tw_hash[:place][:bounding_box][:coordinates].first.first
		end

		def initialize(tw_obj, search_term)
			tw_hash = tw_obj.to_h
			coordinates = Tweet.handle_coordinates(tw_hash)

			@tweet = {
				:search_term => search_term, 
				:coordinates => coordinates
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