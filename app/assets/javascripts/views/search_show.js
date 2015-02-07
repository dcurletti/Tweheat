Tweheat.Views.SearchShow = Backbone.View.extend({

	className: 'search-show',

	events: {
		'click #new-search' : 'search',
		'click #pause': 'toggleSSEListener'
	},

	template: JST['index'],

	initialize: function () {
		this.mapView = new Tweheat.Views.MapShow();

		this.draw = true;

		this.counter = 0;
		this.paused = false;

		// Used to contain tweets when the map is being dragged
		this.tweetQueue = [];

		this.addSSEListener();
		this.addMapListener();
		// Set this to deal with 
	},

	tweetHandler: function (event) {

  	this.counter += 1;
    var tweet = $.parseJSON(event.data);

    // TEMP: Abstract this into a new function
    if (this.draw) {

    	_.each(this.tweetQueue, function(queued_tweet) {
		 		this.mapView.handleTweet(queued_tweet);
    	}.bind(this));
    	
	 		this.mapView.handleTweet(tweet);
	 		this.tweetQueue = [];

    } else {

    	this.tweetQueue.push(tweet);
    }

 		//TEMP: Updating a small counter
 		this.updateCounter(this.counter)
	},

	addSSEListener: function () {
	  // Listener for Tweets from the server
  	this.source = new EventSource("/tweets/stream");
	
		this.tweetHandlerVar = this.tweetHandler.bind(this);

	  this.source.addEventListener('tweet', this.tweetHandlerVar, false);
	  	
	},


	addMapListener: function ()	 {
		this.mapView._map.on('movestart', function(event) {
			this.draw = false;
		}.bind(this));
		this.mapView._map.on('moveend', function(event) {
			this.draw = true;
		}.bind(this));
	},

	//TEMP:
	updateCounter: function (num) {
		this.$("#counter").html("<p>" + num + "</p>")
	},

	attachMap: function () {
		this.$('#map').html(this.mapView.$el)
	},

	render: function () {
		this.attachMap();

		var renContent = this.template({});
		this.$el.append(renContent);

		return this;
	},

	search: function (event) {
		event.preventDefault();
		console.log(event.currentTarget);
		
	}, 

	addLayer: function (layer, name, zIndex) {
	},

	toggleSSEListener: function (event) {

		if (this.paused) {
			console.log("Restarting stream...")
			this.source.addEventListener('tweet', this.tweetHandlerVar, false);
			this.paused = false;
		} else {
			console.log("Pausing stream...")
			this.source.removeEventListener('tweet', this.tweetHandlerVar, false);
			this.paused = true;
		}
	}

})