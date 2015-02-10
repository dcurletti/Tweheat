Tweheat.Views.SearchShow = Backbone.CompositeView.extend({
	className: 'search-show',

	events: {
		'submit form': 'test',
		'click .destroy': 'destroySubview'
	},

	template: JST['index'],

	initialize: function () {
		this.currentColors = [];

		// Create subviews based on user searches
		// this.addLayerListener();

		this.currentLayerIndex = 1;
		
		this.websocket();
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
		var searchBarValue = searchBar.val();
		var siblings = searchBar.siblings();

		if (!this.validateSearchTerm(searchBarValue)) {
			searchBar.parent().addClass("error");
			searchBar.addClass("error");
			if ( siblings.length === 0 ) { 
				searchBar.after("<small class='error'>Only one word at a keyword at a time!</small>") 
			}
		} else {
			searchBar.parent().removeClass("error");
			searchBar.removeClass("error");
			searchBar.nextAll().remove();

			var data = { search_term: searchBarValue };
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
		}

	},

	validateSearchTerm: function (input) {
		var searchTerm = $.trim(input);

		if (/\s/.test(searchTerm)) {
			return false
		} else {
			return true
		}
	}, 

	addLayer: function (search_term, zIndex) {
		// TEMP: exclude colors that are already in play
		var color = this.randomColor();

		// Tweheat.mapView._map.on("layeradd", function (event) {
		// 	debugger
		// })

		var subView = new Tweheat.Views.LayerCard({
			layerName: search_term, 
			zIndex: zIndex,
			color: color
		});
		
		// subView.heatLayer.on("load", function(event) {
		// 	console.log("Shocked this worked")
		// })


		this.addSubview("#layers", subView);


		$("#layers").append(subView.render().$el)
	}, 

	randomColor: function () {
  	return Math.floor(Math.random()*16777215).toString(16);
	}, 

	destroySubview: function (event) {
		var layerName = $(event.target).attr("data-id");

		var subView = _.find(
			this.subviews('#layers'),
			function (subView) {
				return subView.layerName === layerName;
		});

		subView.destroyView();

		this.removeSubview('ul.feeds', subView);

	},

	websocket: function () {
		var task = {
		  name: 'Start taking advantage of WebSockets',
		  completed: false
		}

		Tweheat.dispatcher.trigger('client_connected', task);

	}, 

	// test: function (event) {
	// 	Tweheat.dispatcher.trigger('')
	// }

})