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
- [ ] Implement front end control for different tweet layers
- [ ] Create a method that removes session token from Twitter Streamer on user logout

- [X] On submit: new view is created
- [ ] Create back end filter
- [ ] Create front end filter



## Future features
- [ ] The addition of the points is not on map drag, its on map "stop moving", if you do an inertia swipe, it freaks out still
- [ ] Make an animation when searching for current location
- [ ] Look into heroku scheduler
- [ ] Have search button be an icon
- [ ] Look into changing the default controls
- [ ] Ask for sites that show how to create jquery animations

## Would Be Nice
- [ ] Figure out how to run a rake process for API Trends call
- [ ] Set MaxView on map
- [ ] Saving the current session token into a cookie

###Issues-
- [ ] Look into removing TMP folder in gitIgnore
- [ ] Make sure to close the Twitter Stream when noone is connected to the website
- [ ] Fix scrolling of the layers on map redraw- Problem is being caused either by the constantly updating layer or general performance issues by the client processing the tweet
- [ ] Look into the continous Socket requests from the client when the server goes down
- [ ] Look into growing size of repo
- [ ] Removed redis ping, might be a problem in the long run
- [ ] Look into pinching and zooming animations on mobile devices for refresh

###Fixed-
- [X] Getting heroku to allow websockets
- [X] Checking Twitter geo_enabled and coordinates coorelation
- [X] Still being asked for SSH keys in terminal
- [X] Rescue ActionController::Live DisconnectedClient error
- [X] Saving the Mapbox JS files locally is causing icon loading issues (its trying to fetch them from the server, but its doing a local request)
