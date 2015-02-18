#ToDo-
## Day 1-
- [X] Setting up puma on rails
Added Profile and Config file
- [X] Implement Postgresql 
- [X] Implement current javascript libraries in rails
- [X] Create safe API keys
- [X] Implement test code into new project
- [X] Setup NewRelic Monitoring/Pinging

## Day 2- 
- [X] Setup SSH key with github
- [X] Server- sorting for tweets that have geolocation 
- [X] Add Backbone Views
- [X] Integrate Backbone and Mapbox
- [X] Change Mapbox Look
- [X] Backbone/Twitter integration working
- [X] Add Foundation

## Day 3- 
- [X] Create search bar div
- [X] Handle form request
- [X] refactor layers and tweet handling into the map show- follow the Backbone/Gmap AA example
- [X] Find trending topics API
- [X] Fix heroku credentials
- [X] Remove TurboLinks
- [X] Have a tweet number counter
- [X] Refactored Twitter Streaming Client into a module
- [X] Refactored credentials creation
- [X] Added Twitter Worker thread to control connected clients
- [X] Moved Twitter::Streaming HTTP connection to be a Middleware process

## Day 4-
- [X] Twitter Streaming Client now publishes tweets via Redis
- [X] Setup redis server on heroku
- [X] Add different base layers
- [X] Implement different basic layer options
- [X] Removed temp blur effect to map for hover over search bar

## Day 5-
- [X] Switched to using Mapbox CDN
- [X] Updated to latest Mapbox Locate version
- [X] Button that stops pauses a stream
- [X] Figure out how to restart twitter worker
- [X] Enable users to search for requests
- [X] On submit: new view is created

## Day 6-
- [X] Backend filtering/searching complete
- [X] Implement front end control for different tweet layers
- [X] Create different layers based on searches
- [X] Create a method that removes session token from Twitter Streamer on user logout
- [X] Clear empty Search term sets on new_search

## Day 7-
- [X] Subview destroy (should remove listeners as well)
- [X] Opacity Button
- [X] Destroy view and events button
- [X] Form validation



## Day 8- 
- [X] Problem when hovering over counter
- [ ] Figure out event machine problem
- [X] Change the form button to be something else
- [ ] Figure out how to kill the thread
- [ ] Form validation if user already has created that layer
- [X] Fix routes

## Day 9-
- [X] User shouldn't be allowed to send a blank request
- [X] Popup button for all tweets on form if no layers are left
- [ ] Have button animate until ajax response is back- Could still use some work

- [ ] Input listener to update form
- [ ] Have search button be an icon
- [ ] Make an animation when searching for current location
- [ ] Look into changing the default controls
- [ ] Look into heroku scheduler

## Day 10- 
- [ ] Update the way the toggleColor happens
- [ ] Fix the counter with animated numbers- Doesn't do cool animation

## Before presentations
- [ ] Change the color of icons when clicked


## Finished post-presentation
- [X] Remove the spinning marker after the location has been found
- [X] Socket goes in search show layer
- [X] Iterate through the current views, and add it to each view's collection if appropriate
- [X] Backend has to kill threads
- [X] Enable backend to allow for searching
- [ ] Don't allow for multiple search terms
- [ ] Perfect the isolate animation
- [ ] Need to add color coordination between layers and dots
- [ ] Start counter at 0 rather than 99999

## Would Be Nice
- [ ] Figure out how to run a rake process for API Trends call
- [ ] Set MaxView on map

###Issues-
- [ ] Look into removing TMP folder in gitIgnore
- [ ] Look into the continous Socket requests from the client when the server goes down
- [ ] Look into growing size of repo
- [ ] Make sure to close the Twitter Stream when noone is connected to the website- This might not actually be an issue
- [ ] Look into client data count when connected to site

###Fixed-
- [X] Look into pinching and zooming animations on mobile devices for refresh
- [X] Getting heroku to allow websockets
- [X] Checking Twitter geo_enabled and coordinates coorelation
- [X] Still being asked for SSH keys in terminal
- [X] Rescue ActionController::Live DisconnectedClient error
- [X] Saving the Mapbox JS files locally is causing icon loading issues (its trying to fetch them from the server, but its doing a local request)
- [X] Fix map redraw



turning off websocket-rails
1. gemfile
2. comment out events.rb
3. comment out websocket_rails.rb
4. comment out eventmachine.rb
5. comment out socketcontroller
