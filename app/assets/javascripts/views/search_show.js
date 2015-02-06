Tweheat.Views.SearchShow = Backbone.View.extend({

	className: 'search-show',

	events: {
		'submit form' : 'search'
	},

	template: JST['index'],

	initialize: function () {
		this.mapView = new Tweheat.Views.MapShow();
		this.addSSEListener();
		this.addMapListener();

		// Set this to deal with 
		this.draw = true;
	},

	addSSEListener: function () {
	  // Listener for Tweets from the server
  	this.source = new EventSource("/tweets/stream");
		
		var counter = 0;
		// Used to contain tweets when the map is being dragged
		var tweetQueue = [];

	  this.source.addEventListener('tweet', function (event) {
	  	counter += 1;
	    var tweet = $.parseJSON(event.data);

	    // TEMP: Abstract this into a new function
	    if (this.draw) {

	    	_.each(tweetQueue, function(queued_tweet) {
			 		this.mapView.handleTweet(queued_tweet);
	    	}.bind(this));
	    	
		 		this.mapView.handleTweet(tweet);
		 		tweetQueue = [];

	    } else {
	    	tweetQueue.push(tweet);
	    }

	 		//TEMP: Updating a small counter
	 		this.updateCounter(counter)
	  }.bind(this))

	},

	addMapListener: function ()	 {
		this.mapView._map.on('dragstart', function(event) {
			console.log("dragstart")
			this.draw = false;
		}.bind(this));
		this.mapView._map.on('dragend', function(event) {
			console.log("dragend")
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
	}

})