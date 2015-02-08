Tweheat.Views.SearchShow = Backbone.CompositeView.extend({
	className: 'search-show',

	events: {
		'submit form': 'search',
		'click #pause': 'toggleSSEListener'
	},

	template: JST['index'],

	initialize: function () {
		this.counter = 0;
		this.paused = true;
		this.currentColors = [];
		// Used to contain tweets when the map is being dragged
		this.tweetQueue = [];

		this.tweetHandlerVar = this.tweetHandler.bind(this);

		this.toggleSSEListener();

		Tweheat.twitterStream.addEventListener('layer', function (event) {
			var search_term = $.parseJSON(event.data).search_term
			var color = this.randomColor();
			var subView = new Tweheat.Views.LayerCard({
				layer: search_term, 
				color: color
			});
			debugger;
			this.addSubview("#layers", subView);
		}.bind(this))
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
	},

	tweetHandler: function (event) {

  	this.counter += 1;
    var tweet = $.parseJSON(event.data);
    // debugger;

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
		var searchBar = $('#search-item');
		var searchTerm = searchBar.val();
		var data = { search_term: searchTerm };

		console.log("Attempting submit..")

		$.ajax({
			url: '/tweets/search',
			dataType: "json",
			data: data,
			method: "GET",
			success: function () {
				searchBar.val('');
				console.log("Successfully sent");
			}
		});
	}, 

	addLayer: function (layer, name, zIndex) {


	}, 

	randomColor: function () {
  	return Math.floor(Math.random()*16777215).toString(16);
	}

})