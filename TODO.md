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
- [ ] Fix errors being caused by missing mapbox icons in mapbox library

## Day 3- 
- [ ] Add Foundation


## Future features
- [ ] Set MaxView on map
- [ ] Look into changing the default controls

###Issues-
- [ ] Getting heroku to allow websockets- This might not work until I install Redis 
- [ ] Saving the Mapbox JS files locally is causing icon loading issues (its trying to fetch them from the server, but its doing a local request)
- [ ] Check the ActioController Streaming "ensure - close stream"- might have new way of closing
- [ ] Research on how to create a background process for running the Twitter:Streaming Client
- [ ] Figure out the redis pub/sub system
- [ ] Slow loading speed of heroku
- [ ] Make sure to close the Twitter Stream when noone is connected to the website
- [ ] Fix scrolling of the layers on map redraw- Problem is being caused either by the constantly updating layer or general performance issues by the client processing the tweet
- [ ] Look into the continous Socket requests from the client when the server goes down

###Fixed-
- [X] Checking Twitter geo_enabled and coordinates coorelation
- [X] Still being asked for SSH keys in terminal
