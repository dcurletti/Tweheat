Tweheat.Views.SearchShow = Backbone.View.extend({

	className: 'search-show',

	events: {
		'click #new-search' : 'search',
		'click #pause': 'toggleSSEListener'
	},

	template: JST['index'],

	initialize: function () {

		this.counter = 0;
		this.paused = false;

		// Used to contain tweets when the map is being dragged
		this.tweetQueue = [];

		this.addSSEListener();
		// Set this to deal with 
	},

	tweetHandler: function (event) {

  	this.counter += 1;
    var tweet = $.parseJSON(event.data);

    // TEMP: Abstract this into a new function
    if (Tweheat.mapView.panning) {

    	_.each(this.tweetQueue, function(queued_tweet) {
		 		Tweheat.mapView.handleTweet(queued_tweet);
    	});
    	
	 		Tweheat.mapView.handleTweet(tweet);
	 		this.tweetQueue = [];

    } else {
    	this.tweetQueue.push(tweet);
    }

 		//TEMP: Updating a small counter
 		this.updateCounter(this.counter)
	},

	addSSEListener: function () {
	  // Listener for Tweets from the server
  
	
		this.tweetHandlerVar = this.tweetHandler.bind(this);

	  Tweheat.twitterStream.addEventListener('tweet', this.tweetHandlerVar, false);
	  	
	},

	//TEMP:
	updateCounter: function (num) {
		this.$("#counter").html("<p>" + num + "</p>")
	},

	attachMap: function () {
		this.$('#map').html(Tweheat.mapView.$el)
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
			Tweheat.twitterStream.addEventListener('tweet', this.tweetHandlerVar, false);
			this.paused = false;
		} else {
			console.log("Pausing stream...")
			Tweheat.twitterStream.removeEventListener('tweet', this.tweetHandlerVar, false);
			this.paused = true;
		}
	}

})