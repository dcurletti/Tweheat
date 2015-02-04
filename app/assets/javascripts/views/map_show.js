Tweheat.Views.MapShow = Backbone.View.extend({
	//TEMP might want to change this id
	attributes: {
		id: "map-canvas"
	},

	initialize: function () {
		this.installMap();
	},

	installMap: function () {
		//TEMP this API token needs to be moved
	  //Mapbox API token
	  L.mapbox.accessToken = 'pk.eyJ1IjoiZGN1cmxldHRpIiwiYSI6IkpYT1NXb1UifQ.3VKg9h5-Aoxmk9e1yROPmQ';

    //TEMP: starting position, replace with current location, or huge US view
	  var startingPosition = [37.8304718, -122.2794226];
	  var startingZoom = 13;

		var map = L.mapbox.map('map', 'dcurletti.knl7n7kb').setView(startingPosition, startingZoom);


	},

	render: function () {

		var renContent = this.template()
		this.$('#map').html(Tweheat.mapView.$el)
	}




})