Tweheat.Views.LayerCard = Backbone.View.extend({
	
	tagName: "li",

	template: JST['layer_card'],

	events: {
		'click .pause': 'toggleSSEListener',
		'click .opacity': 'toggleOpacity'
	},

	initialize: function  (options) {
		this.layerName = options.layerName;
		this.zIndex = options.zIndex;
		this.counter = 0;
		this.paused = true;
		this.showingLayer = true;
				
		this.addHeatLayer(this.layerName, this.zIndex);
		// Used to contain tweets when the map is being dragged
		this.tweetQueue = [];

		// TEMP: Could be used for playback
		this.tweets = [];

		this.tweetEventVar = this.tweetEvent.bind(this);

		// this.toggleSSEListener();
	},

	addHeatLayer: function (color, zIndex) {
		this.heatLayer = L.heatLayer([], { maxZoom: 9, radius: 15, blur: 20 } ).addTo(Tweheat.mapView._map);
	},

	toggleSSEListener: function (event) {
		if (this.paused) {
			console.log("Restarting stream...")
			Tweheat.twitterStream.addEventListener(this.layerName, this.tweetEventVar, false);
			this.paused = false;
		} else {
			console.log("Pausing #{this.layerName} stream...")
			Tweheat.twitterStream.removeEventListener(this.layerName, this.tweetEventVar, false);
			this.paused = true;
		}
	},

	tweetEvent: function (event) {
  	this.counter += 1;
    var tweet = $.parseJSON(event.data);

    // TEMP: Abstract this into a new function
    if (Tweheat.mapView.panning) {
    	this.tweetQueue.push(tweet);
    } else {
    	_.each(this.tweetQueue, function(queued_tweet) {
		 		this.handleTweet(queued_tweet);
    	}.bind(this));
    	
	 		this.handleTweet(tweet);
	 		this.tweetQueue = [];
    }

 		//TEMP: Updating a small counter
 		this.updateCounter(this.counter)
	},

	handleTweet: function (tweet) {
		//TEMP: factor into handle tweet
    var coordinates = tweet.coordinates;
    var latlng = L.latLng(coordinates[1], coordinates[0])
    // console.log(latlng);
    this.heatLayer.addLatLng(latlng);
	},

	//TEMP:
	updateCounter: function (num) {
		this.$(".counter").html("<p>" + num + "</p>")
	},
 
	render: function(){
		var renContent = this.template({ layerName: this.layerName });
		this.$el.html(renContent);
		return this;
	},

	toggleOpacity: function (event) {
		// TEMP: Need to figure out how to make it opaque
		if (this.showingLayer) {
			this.removeLayer();
			this.showingLayer = false;
		} else {
			this.heatLayer.addTo(Tweheat.mapView._map)
			this.showingLayer = true;
		}		

	}, 

	destroyView: function (event) {
		this.toggleSSEListener();
		this.removeLayer();
		this.remove();

	}, 

	removeLayer: function () {
		Tweheat.mapView._map.removeLayer(this.heatLayer)
	}

})