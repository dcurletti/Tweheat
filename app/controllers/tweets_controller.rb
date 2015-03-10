require "twitter_package"

class TweetsController < ApplicationController

	before_filter :require_session_token!

	def index
		# puts "WELCOME #{token}"
		check_in
	end

	def search
		# How to get the search item
		# Look up sending the form through jquery
		search_term = params[:search_term]
		
		RedisStream.sub_to_search_stream( search_term, token )

		test = { hello: "good job" }

		# To allow for success callback from fetch
		respond_to do |format|
			format.json { render json: test }
		end
	end

	def show
		tw_client = TwitterPackage.new_rest_client

		places = tw_client.trends(23424977)
		
		puts places

		render json: places.to_h
	end

end
