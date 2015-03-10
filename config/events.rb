WebsocketRails::EventMap.describe do
  
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  #   subscribe :client_connected, :to => Controller, :with_method => :method_name
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  #     subscribe :new, :to => ProductController, :with_method => :new_product
  #   end
  # The above will handle an event triggered on the client like `product.new`.
  subscribe :client_connected, :to => SocketsController, :with_method => :user_connected
  subscribe :new_message, :to => SocketsController, :with_method => :incoming_message
  subscribe :set_name, :to => SocketsController, :with_method => :set_name
  subscribe :client_disconnected, :to => SocketsController, :with_method => :client_disconnected

  namespace :test do
    subscribe :new_message, :to => SocketsController, :with_method => :incoming_message
  end
end