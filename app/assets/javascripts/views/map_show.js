Tweheat.Views.MapShow = Backbone.View.extend({
	//TEMP might want to change this id
	attributes: {
		id: "map-canvas"
	},

	initialize: function () {
		// Used to prevent redraw errors
		this.panning = false;

		// Load the map
		this.installMap();
		this.addUIElements();
		this.addListeners();
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
			zoomControl: false
		}).setView(startingPosition, startingZoom);

		//TEMP: refactor into base layer fun
		// Various Base Layer options
		var baseLayers = {
			DarkTheme: L.mapbox.tileLayer('dcurletti.knl7n7kb'),
			"<span id='test'>My Layer</span>": L.mapbox.tileLayer('dcurletti.l56kdbi6'),
			Satellite: L.mapbox.tileLayer('dcurletti.l56dl8ml')
		};

		// Adding Base Layers to map, UI layers button
		baseLayers.DarkTheme.addTo(this._map).once('load', function (event) {
			console.log("Map Loaded");
			$('body').trigger("mapLoaded")
		});

		L.control.layers(baseLayers).addTo(this._map);
	},

	addUIElements: function () {
		// Add Zoom UI controls
		new L.Control.Zoom({ position: 'topright' }).addTo(this._map);
		
		// Add locate me button 
		L.control.locate({
			position: 'topright'
		}).addTo(this._map);

		// Hack for Foundation tour 
		$('.leaflet-control-layers-toggle').attr('id', 'map-layer-control');
		$('.leaflet-bar-part.leaflet-bar-part-single').attr('id', 'map-locate-control');
	},

	addListeners: function ()	 {
		// User moving the map
		this._map.on('movestart', function(event) {
			this.panning = true;
		}.bind(this));
		this._map.on('moveend', function(event) {
			this.panning = false;
		}.bind(this));
		// User resizing the window
		this._map.on('resize', function(event) {
			if (this.panning) {
				this.panning = false;
			} else {
				this.panning = true;
			}
		}.bind(this));
	},



})