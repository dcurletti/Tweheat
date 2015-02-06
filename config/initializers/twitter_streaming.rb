# Initiates a TwitterStreamWorker

require 'twitter_stream_worker'

worker = TwitterStreamWorker.new

at_exit do
	worker.kill
end

puts "\n\nA new worker has been created"