class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user

  def token
  	session[:session_token] 
  end

  def check_in
  	session[:session_token] = SecureRandom.urlsafe_base64(16)

    # RedisStream.publish_new_user( token )
  end

  def require_session_token!
  	check_in unless session[:session_token]
  end
end
