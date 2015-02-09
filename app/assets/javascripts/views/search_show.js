Tweheat.Views.SearchShow = Backbone.CompositeView.extend({
	className: 'search-show',

	events: {
		'submit form': 'search'
	},

	template: JST['index'],

	initialize: function () {
		this.currentColors = [];

		// Create subviews based on user searches
		this.addLayerListener();

		this.currentLayerIndex = 1;

	},

	render: function () {
		this.attachMap();

		var renContent = this.template({});
		this.$el.append(renContent);
		
		// Create the initial All Tweets layer
		this.addLayer("All Tweets", 1)

		return this;
	},

	attachMap: function () {
		this.$('#map').html(Tweheat.mapView.$el)
	},

	addLayerListener: function () {
		Tweheat.twitterStream.addEventListener('layer', function (event) {
			var data = $.parseJSON(event.data)

			this.addLayer(data.search_term, 1)

		}.bind(this))
	},

	search: function (event) {
		event.preventDefault();
		var searchBar = $('#search-item');
		var searchTerm = searchBar.val();
		var data = { search_term: searchTerm };
		var that = this;

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

	addLayer: function (search_term, zIndex) {
		// TEMP: exclude colors that are already in play
		var color = this.randomColor();

		var subView = new Tweheat.Views.LayerCard({
			layer: search_term, 
			color: color
		});
		// this.addSubview("#layers", subView);
		$("#layers").append(subView.render().$el)
	}, 

	randomColor: function () {
  	return Math.floor(Math.random()*16777215).toString(16);
	}

})