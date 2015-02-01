# Tweheat

[Heroku link][heroku]

[heroku]: 

## Minimum Viable Product
Realtime twitter heat map that supports multiple concurrent searches. Users can:

- [x] Interact with a map (Mapbox API)
- [x] Find their current location (Leaflet API)
- [x] Connect to Twitter Streaming API
- [ ] Select from trending topics
- [ ] Search for specific topics/keywords
- [ ] View a "heat map" visualization of tweets based on their search topic
- [ ] Toggle previous searches on and off
- [ ] Combine multiple searches and overlay them 


## Design Docs
* [View Wireframes][views]
* I do not plan on having any database for the MVP. If I get done early there are a 
few features I can think of that might require it, but for now I would prefer keeping
everything streaming and in memory. 

[views]: ./docs/views.md
[schema]: ./docs/schema.md

## Implementation Timeline

### Phase 0: Pre-work
I have managed to implement the Mapbox API with rails as well as establishing an 
asynchronous connection with the Twitter Streaming API using ActionController Streaming
on the backend, EventSource on the front end and Puma as the server.  I looked into 
Faye, Websocket, Socket.io and Event Machine, but I think that my current solution 
should be enough for this project. It would be more simple to use Node.js, but I'm 
assuming it would be frowned upon if I didn't use Rails. The server will only ever push 
JSON tweets, nothing more.  If the app is noticeably laggy, I might need to change delivery if time permits towards the end. Currently have both the front and back end working 
separately, but have not combined the API with the marker addition.

[Details][phase-zero]
### Phase 1: Finalizing backend asynchronous twitter API (~1 day)
Stripping the Twitter::Tweet class of any unncesseary information and packaging it into
a new hash for the front end to use.  Making sure that the search region of the tweets
is limited to the bounding box of the users map (this might change because you don't 
necessarily want to miss out on mapped tweets just because you are too zoomed in- possibly
limit to the US.)

[Details][phase-one]

### Phase 2: Backbone (~1.5 days)
Create Backbone views for the map and the search bar.  Implement Zurb Foundation as the 
front end response framework. Create collections and models for the tweet, as well as a 
model and collection for Mapbox Layers (i.e. the different searches the user has made.) 

[Details][phase-two]

### Phase 3: Connecting API with Backbone (~1 day)
Making sure that the Backbone collections and models response to the API stream and
correctly place heat markers onto the map.  At this point I will also be focusing on
adjusting the look of the map and ensuring that it works at all zoom levels. 

[Details][phase-three]

### Phase 4: Search Bar Integration/ Multiple Maps (~2 day)
Updating the Twitter stream to search for the newly inputted search term.  Update the
view accordingly.  Also making sure to retain previous searches (keep the last 3) and
making sure that even if a map is not currently being displayed, that it is still 
accumulating tweet data.  Search model and collection.

[Details][phase-four]

### Phase 5: Styling and jQuery/CSS animations (~2 days)
Hardcore CSS and jQuery mode.  Going after a simple look such as Google maps, where the 
search bar is just an input, but once you click on it or hover over it, it shows 
the relevant data.  Shouldn't require too much div sytling, mostly just making nice CSS 
animations.

[Details][phase-five]
### Phase 6: Adding Bonus features (Until final presentation)
Main feature I will try to implement is a realtime Twitter Search bar.  I saw
Mozilla has a github repo for it, so I might be able to implement that.
Adding a cool animation when a heat marker is added to the map would be nice,
and then trying to implement any of the other features from below.

### Bonus Features (TBD)
- [ ] Make the search bar show realtime results like Twitter
- [ ] Cool animation on dropping heat marker
- [ ] Change the color of the map depending on the time of day
- [ ] Switch from "Heat Map" to "Tweet Markers"- shows detailed view of tweets and 
			their context
- [ ] User login and allowing for tweet composition with geo tagging
- [ ] Allow for a "replay mode", aka allowing a user to quickly replay the tweet mapping 
			at 10x speed

[phase-zero]: ./docs/phases/phase0.md
[phase-one]: ./docs/phases/phase1.md
[phase-two]: ./docs/phases/phase2.md
[phase-three]: ./docs/phases/phase3.md
[phase-four]: ./docs/phases/phase4.md
[phase-five]: ./docs/phases/phase5.md

