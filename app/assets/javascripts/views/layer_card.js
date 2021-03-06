Tweheat.Views.LayerCard = Backbone.View.extend({
	
	tagName: "li",

	template: JST['layer_card'],

	events: {
		'click .layer': 'isolateTrigger',
		'click .pause': 'toggleSSEListener',
		'click .opacity': 'toggleOpacity',
		'click .destroy': 'destroyTrigger',
		'mouseenter': 'toggleLayerView',
		'mouseleave': 'toggleLayerView'
	},

	initialize: function  (options) {
		this.layerName = options.layerName;
		this.zIndex = options.zIndex;
		this.counter = 0;
		this.paused = true;
		this.showingLayer = true;
		this.heatMode = this.zIndex === 1 ? true : false

		this.gradient = this.randomGradient();
		this.isolated = false;
						
		this.addHeatLayer(this.zIndex);
		// Used to contain tweets when the map is being dragged
		this.tweetQueue = [];

		this.tweetEventVar = this.tweetEvent.bind(this);

		this.channel = Tweheat.dispatcher.subscribe(this.layerName)

		this.toggleSSEListener();
	},

	addHeatLayer: function (zIndex) {
		var settings = null;
		if ( zIndex === 1 ) {
			settings = this.standardHeatSettings();
		} else {
			settings = this.circleSettings();
		}
		var gradient = 

		this.heatLayer = L.heatLayer([], { 
			maxZoom: settings.maxZoom, 
			radius: settings.radius,
			blur: settings.blur,
			minOpacity: settings.minOpacity,
			gradient: gradient 
		})

		this.heatLayer.addTo(Tweheat.mapView._map);
		this.layerID = this.heatLayer._leaflet_id;
	},

	toggleSSEListener: function (event) {
		if (event) {event.stopPropagation()};
		var $target = this.$('.control-button.pause');

		if (this.paused) {
			$target.removeClass('selected-btn');
			console.log("Opening " + this.layerName + " stream...")
			this.channel.bind("newTweet", this.tweetEventVar);
			this.paused = false;
		} else {
			$target.addClass('selected-btn');
			console.log("Closing " + this.layerName + " stream...")
			this.channel.unbind("newTweet");
			this.paused = true;
		}
	},

	tweetEvent: function (data) {
    if (Tweheat.mapView.panning) {
    	this.tweetQueue.push(data);
    } else {
    	_.each(this.tweetQueue, function(queued_tweet) {
		 		this.handleTweet(queued_tweet);
    	}.bind(this));
    	
	 		this.handleTweet(data);
	 		this.tweetQueue = [];
    }

 		//TEMP: Updating a small counter
 		this.updateCounter()
	},

	handleTweet: function (tweet) {
    var coordinates = tweet.coordinates;
    var latlng = L.latLng(coordinates[1], coordinates[0])

    // Actually places the tweet onto the map
    this.heatLayer.addLatLng(latlng);
	},

	updateCounter: function () {
		this.counter += 1;
		var that = this;
		var $digits = $("[data-id='" + this.zIndex +"']").find('ul');
		
		var pad = function (n, width, z) {
		  z = z || '0';
		  n = n + '';
		  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		};

		var something = function() {
		  $digits.each(function(i, el){
		    var val = pad(that.counter, 5, 0).split("");
		    var $el = $(this);
		    $el.removeClass();
		    $el.addClass('goto-' + val[i]);
		  })
		};

		something();

		var counter = function () {
	    $digits.each(function(i, el){
	      var val = pad(that.counter, 5, 0).split("");
	      var $el = $(this);
	      $el.removeClass();
	      $el.addClass('goto-' + val[i]);
	    })
		};

		counter();
		
	},
 
	render: function(){
		var renContent = this.template({ 
			layerName: this.layerName,
			zIndex: this.zIndex,
			layerID: this.layerID
		});
		this.$el.html(renContent);
		return this;
	},

	toggleOpacity: function (event) {
		$button = this.$('.control-button.opacity');

		if (event !== "undefined") { event.stopPropagation() };
		if ( this.showingLayer ) {
			$button.addClass('selected-btn');
			Tweheat.mapView._map.removeLayer(this.heatLayer);
			this.showingLayer = false;

		} else {
			$button.removeClass('selected-btn');
			this.heatLayer.addTo(Tweheat.mapView._map)
			this.showingLayer = true;
		}		
	}, 

	destroyView: function (event) {
		if ( !this.paused ) {
			// TEMP: Should be reinstated after demo
			// Tweheat.dispatcher.unbind(this.layerName);
		};
		Tweheat.mapView._map.removeLayer(this.heatLayer)
		this.remove();
	},  

	randomGradient: function () {
		var randomHue = function getRandomArbitrary(min, max) {
			  return Math.floor( Math.random() * (max - min) + min );
		}

		var hexColor = Please.make_color({ 
			hue: randomHue( 17, 320 ),
			saturation: 1, 
			value: 1,
			golden: false,
			format: 'rgb-string'
		})

		lastColor = hexColor;

  	return { 1: hexColor };
	}, 

	chooseGradient: function () {
		return (this.zIndex === 1 && this.heatMode ? standardHeatColors : this.randomGradient)
	},

	toggleLayerView: function (event, gradient) {
		if (event !== "undefined") { event.stopPropagation() };
		
		event = typeof event !== 'undefined' ? event : event.type;
		
		var circle = this.circleSettings();
		var radius = circle.radius;

		if (event.type === "mouseenter" ) {
			gradient = { 1: "red" };
			var radius = circle.radius + 3;
		} else if ( event.type === "mouseleave" ) {
			gradient = this.gradient;
		}

		var blur = circle.blur;
		var minOpacity = circle.minOpacity;
		var maxZoom = circle.maxZoom;

		if ( event.type === "mouseleave" && ( this.isolated || this.heatMode )) { 
			var std = this.standardHeatSettings();
			radius = std.radius;
			blur = std.blur;
			gradient = std.gradient;
			minOpacity = std.minOpacity;
		  maxZoom = std.maxZoom;
		 };

		this.heatLayer.setOptions({ 
			radius: radius, blur: blur, maxZoom: maxZoom, gradient: gradient,
			minOpacity: minOpacity })
	},

	removeHeat: function () {
		if ( this.heatMode && !this.isolated ) {
			this.heatMode = false;
			this.toggleLayerView( "undefined", this.gradient );
		}
	},

	standardHeatColors: function () {
		return {
      0.4: 'blue',
      0.6: 'cyan',
      0.7: 'lime',
      0.8: 'yellow',
      1.0: 'red'
    };
	},

	standardHeatSettings: function () {
		return { 
			radius: 15,
			blur: 20,
			gradient: this.standardHeatColors(),
			minOpacity: .05,
		  maxZoom: 9
		 }
	},

	circleSettings: function () {
		return {
			radius: 5,
			blur: 2,
			minOpacity: .5,
			maxZoom: 7
		}
	}, 

	destroyTrigger: function (event) {
		this.$el.find(".layer").trigger("destroyLayer")
	},

	isolateTrigger: function (event) {
		event.stopPropagation();

		if (!this.isolated) {
			this.$el.find(".layer").trigger("layerIsolate")
		} else {
			this.toggleIsolate();
		}
	}, 

	toggleIsolate: function () {
		if (this.isolated) {
			this.isolated = false;
			this.$el.find('.layer').velocity({ translateX: "0px" }, 150 )
					.removeClass("isolated");
		} else {
			this.isolated = true;
			if (!this.showingLayer) { this.toggleOpacity("undefined") };
			this.$el.find('.layer').velocity({ translateX: "50px" }, 150 )
					.addClass("isolated");
		}
		this.toggleLayerView("undefined");
	}
})