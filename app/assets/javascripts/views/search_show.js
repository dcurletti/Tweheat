Tweheat.Views.SearchShow = Backbone.View.extend({

	className: 'search-show',

	events: {
		'submit form' : 'search'
	},

	template: JST['index'],

	initialize: function () {
		this.mapView = new Tweheat.Views.MapShow();
		this.addListener();
	},

	addListener: function () {
	  // Listener for Tweets from the server
  	this.source = new EventSource("/tweets/stream");
		var counter = 0;

	  this.source.addEventListener('tweet', function (event) {
	  	counter += 1;
	    var tweet = $.parseJSON(event.data);
	    
	 		this.mapView.handleTweet(tweet)
	 		//TEMP: Updating a small counter
	 		this.updateCounter(counter)
	  }.bind(this))

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