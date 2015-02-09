Tweheat.Views.LayerCard = Backbone.View.extend({
	
	tagName: "li",

	template: JST['layer_card'],

	events: {
		'click .pause': 'toggleSSEListener'
	},

	initialize: function  (options) {
		this.layer = options.layer;
		this.counter = 0;
		this.paused = true;
		// Used to contain tweets when the map is being dragged
		this.tweetQueue = [];

		// TEMP: Could be used for playback
		this.tweets = [];

		// this.tweetHandlerVar = this.tweetHandler.bind(this);

		// this.toggleSSEListener();
	},


	toggleSSEListener: function (event) {
		if (this.paused) {
			console.log("Restarting stream...")
			Tweheat.twitterStream.addEventListener(this.layer, this.tweetHandlerVar, false);
			this.paused = false;
		} else {
			console.log("Pausing #{this.layer} stream...")
			Tweheat.twitterStream.removeEventListener(this.layer, this.tweetHandlerVar, false);
			this.paused = true;
		}
	},

	tweetHandler: function (event) {
  	this.counter += 1;
    var tweet = $.parseJSON(event.data);

    // TEMP: Abstract this into a new function
    if (Tweheat.mapView.panning) {
    	this.tweetQueue.push(tweet);
    } else {
    	_.each(this.tweetQueue, function(queued_tweet) {
		 		Tweheat.mapView.handleTweet(queued_tweet);
    	});
    	
	 		Tweheat.mapView.handleTweet(tweet);
	 		this.tweetQueue = [];
    }

 		//TEMP: Updating a small counter
 		this.updateCounter(this.counter)
	},

	//TEMP:
	updateCounter: function (num) {
		this.$(".counter").html("<p>" + num + "</p>")
	},
 
	render: function(){
		var renContent = this.template({ layer: this.layer });
		this.$el.html(renContent);
		return this;
	}

})