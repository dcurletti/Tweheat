Tweheat.Views.MapShow = Backbone.View.extend({
	//TEMP might want to change this id
	attributes: {
		id: "map-canvas"
	},

	initialize: function () {
		this.installMap();
		//TEMP: Eventually add ListenTo events that call handleTweet
	},

	installMap: function () {
		//TEMP this API token needs to be moved
	  //Mapbox API token
	  L.mapbox.accessToken = 'pk.eyJ1IjoiZGN1cmxldHRpIiwiYSI6IkpYT1NXb1UifQ.3VKg9h5-Aoxmk9e1yROPmQ';

    //TEMP: starting position, replace with current location, or huge US view
	  var startingPosition = [39.1233557, -98.3453984];
	  var startingZoom = 5;
  
		this._map = L.mapbox.map('map', 'dcurletti.knl7n7kb').setView(startingPosition, startingZoom);

		L.control.locate().addTo(this._map);		

		//TEMP: refactor in method
	  this.heat = L.heatLayer([], { maxZoom: 9, radius: 15, blur: 14,   } ).addTo(this._map);

	},

	addLayer: function (layerName) {
	  this.layerName = L.heatLayer([], { maxZoom: 9, radius: 15, blur: 14 } ).addTo(Tweheat.mapView._map);
	},

	handleTweet: function (tweet) {
		//TEMP: factor into handle tweet
    var coordinates = tweet.coordinates;
    var latlng = L.latLng(coordinates[1], coordinates[0])
    // console.log(latlng);
    this.heat.addLatLng(latlng);
	} 






})