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
- [ ] Setup SSH key with github
- [ ] Server- sorting for tweets that have geolocation 
- [ ] Fix errors being caused by missing mapbox icons in mapbox library


###Issues-
- [ ] Saving the Mapbox JS files locally is causing icon loading issues (its trying to fetch them from the server, but its doing a local request)
- [ ] Look into the continous Socket requests from the client when the server goes down
- [ ] Check the ActioController Streaming "ensure - close stream"- might have new way of closing
- [ ] Research on how to create a background process for running the Twitter:Streaming Client
- [ ] Figure out the redis pub/sub system
- [ ] Checking Twitter geo_enabled and coordinates coorelation
- [ ] Slow loading speed of heroku
