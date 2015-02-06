class TwitterStreamWorker
	class << self
		def initialize (config = {})
			puts "\n\nStreamWorker initialized"
		end

		def restart_stream
			puts "\n\nRestarting Twitter stream"

			# Kills stream if there is one already
			@stream_thread.kill if @stream_thread

			# Open new stream
			@stream_thread = Thread.new do
				
				begin
					@tw_stream_client = TwitterFactory.new_streaming_client
				rescue
					raise "\n\nUnable to connect to twitter stream"
				end

				@tw_stream_client.filter(locations: filter_bounds) do |tw_obj|
					if tw_obj.is_a? Twitter::Tweet
						tweet = tw_obj.to_h
						puts tweet[:user][:name]
					end
				end
			end
		end

		def new
			puts "\n\nCreating Twitter Stream Worker"

			restart_stream

			@test_thread = Thread.new do
				puts "\n\nOpened a test user thread inside of new"
			end	
		end

		def close
			@test_thread.kill if @test_thread
			@stream_thread if @stream_thread
			puts "\n\nKilling a TwitterStreamWorker"
		end

	end
end