Tweheat.Views.LayerCard = Backbone.View.extend({
	
	tagName: "li",

	template: JST['layer_card'],

	events: {
		'click .pause': 'toggleSSEListener',
		'click .opacity': 'toggleOpacity',
		'mouseenter': 'toggleLayerSize',
		'mouseleave': 'toggleLayerSize'
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

		this.toggleSSEListener();

		// var all_tweets_channel = Tweheat.dispatcher.subscribe("all_tweets");

	},

	addHeatLayer: function (color, zIndex) {
		this.heatLayer = L.heatLayer([], { 
			maxZoom: 9, radius: 15, blur: 20, minOpacity: .2 } )
			.addTo(Tweheat.mapView._map);
	},

	toggleSSEListener: function (event) {
		if (this.paused) {
			console.log("Restarting stream...")
			Tweheat.dispatcher.bind(this.layerName, this.tweetEventVar);
			this.paused = false;
		} else {
			console.log("Pausing " + this.layerName + " stream...")
			debugger
			Tweheat.dispatcher.unbind(this.layerName);
			this.paused = true;
		}
	},

	tweetEvent: function (data) {
  	this.counter += 1;
    var tweet = $.parseJSON(data).data;

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
 		this.updateCounter()
	},

	handleTweet: function (tweet) {
		//TEMP: factor into handle tweet
    var coordinates = tweet.coordinates;
    var latlng = L.latLng(coordinates[1], coordinates[0])
    // console.log(latlng);
    this.heatLayer.addLatLng(latlng);
	},

	//TEMP:
	updateCounter: function () {
		debugger
		this.$(".counter p").val( this.counter )
		this.counter += 1
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
		// this.toggleSSEListener();
		Tweheat.mapView._map.removeLayer(this.heatLayer)
		this.remove();

	},  

	toggleLayerSize: function (event) {
		var radius = 8;
		var blur = 10;
		var gradient = { 0: "red", 1: "red" };
		var minOpacity = .5;
		var maxZoom = 7;

		if (this.heatLayer.options.radius != 15) { 
			radius = 15;
			blur = 20;
			gradient = {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
	    };
			minOpacity = .05;
		  maxZoom = 9;
		 };

		this.heatLayer.setOptions({ 
			radius: radius, blur: blur, maxZoom: maxZoom, gradient: gradient,
			minOpacity: minOpacity })
	}

})