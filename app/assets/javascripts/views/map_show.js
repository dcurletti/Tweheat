Tweheat.Views.MapShow = Backbone.View.extend({
	//TEMP might want to change this id
	attributes: {
		id: "map-canvas"
	},

	initialize: function () {
		// Used to prevent redraw errors
		this.panning = false;

		this.installMap();
		this.addListeners();
		//TEMP: Eventually add ListenTo events that call handleTweet
		// this.addLayer("all_tweets")
	},

	installMap: function () {
		//TEMP this API token needs to be moved
	  //Mapbox API token
	  L.mapbox.accessToken = 'pk.eyJ1IjoiZGN1cmxldHRpIiwiYSI6IkpYT1NXb1UifQ.3VKg9h5-Aoxmk9e1yROPmQ';

    //TEMP: starting position, replace with current location, or huge US view
	  var startingPosition = [39.1233557, -98.3453984];
	  var startingZoom = 5;
  
  	// Creates the actual Mapbox map object
		this._map = L.mapbox.map('map', null, {
			maxZoom: 12,
			zoomControl: false
		}).setView(startingPosition, startingZoom);

		// Various Base Layer options
		var baseLayers = {
			DarkTheme: L.mapbox.tileLayer('dcurletti.knl7n7kb'),
			Streets: L.mapbox.tileLayer('dcurletti.l56kdbi6'),
			Satellite: L.mapbox.tileLayer('dcurletti.l56dl8ml')
		};

		// Adding Base Layers and control widget to the map
		baseLayers.DarkTheme.addTo(this._map);
		L.control.layers(baseLayers).addTo(this._map)

		// Add locate me button 
		new L.Control.Zoom({ position: 'bottomleft' }).addTo(this._map);
		L.control.locate({
			position: 'bottomleft'
		}).addTo(this._map);		

		//TEMP: refactor in method
	  // this.heat = L.heatLayer([], { maxZoom: 9, radius: 15, blur: 14 } ).addTo(this._map);
	},

	addListeners: function ()	 {
		this._map.on('movestart', function(event) {
			this.panning = true;
		}.bind(this));
		this._map.on('moveend', function(event) {
			this.panning = false;
		}.bind(this));
	},



})