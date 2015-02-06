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
- [ ] Show map layers
- [ ] Figure out how to restart twitter worker


## Future features
- [ ] Figure out how to run a background process
- [ ] Look into heroku scheduler
- [ ] Have search button be an icon
- [ ] Look into changing the default controls
- [ ] Ask for sites that show how to create jquery animations

## Would Be Nice
- [ ] Set MaxView on map
- [ ] Scheduling the trends API call to only happen once every 15 minutes

###Issues-
- [ ] Saving the Mapbox JS files locally is causing icon loading issues (its trying to fetch them from the server, but its doing a local request)
- [ ] Look into removing TMP folder in gitIgnore
- [ ] Figure out the redis pub/sub system
- [ ] Make sure to close the Twitter Stream when noone is connected to the website
- [ ] Fix scrolling of the layers on map redraw- Problem is being caused either by the constantly updating layer or general performance issues by the client processing the tweet
- [ ] Look into the continous Socket requests from the client when the server goes down
- [ ] Look into growing size of repo
- [ ] Slow loading speed of heroku
- [ ] Removed redis ping, might be a problem in the long run

###Fixed-
- [X] Getting heroku to allow websockets
- [X] Checking Twitter geo_enabled and coordinates coorelation
- [X] Still being asked for SSH keys in terminal
- [X] Rescue ActionController::Live DisconnectedClient error
