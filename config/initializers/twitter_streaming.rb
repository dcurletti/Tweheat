# Initiates a TwitterStream

require 'twitter_stream'

worker = TwitterStream.new

at_exit do
	worker.kill
end

puts "\n\nA new worker has been created"