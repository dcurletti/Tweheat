	Tweheat.Views.SearchShow = Backbone.CompositeView.extend({
	className: 'search-show',

	events: {
		'submit form': 'search',
		'click .destroy': 'destroySubview',
		// 'focusin input': 'toggleBlurMap',
		// 'focusout input': 'toggleBlurMap'
		// 'test .layer': 'toggleIsolate'
	},

	template: JST['index'],

	initialize: function () {
		this.zIndex = 0;
		this.heatLayers = [];
		this.searchCollections = [];
		this.isolatedLayer = false;
	},

	render: function () {
		this.attachMap();

		var renContent = this.template({});
		this.$el.append(renContent);
		
		this.addLoadAnimations();


		return this;
	},

	createSocket: function () {
		var deliveryMethod = "ws://"
		if (!window.location.host === "localhost:3000") {
			deliveryMethod = "wss://"
		};
		var url = deliveryMethod + window.location.host + '/tweets/stream';

		this.Socket = new WebSocket( url );

		this.Socket.onopen = function () {
			console.log("Websocket is connected")
		}

		this.Socket.onmessage = function (msg) {
			var data = $.parseJSON(msg.data);
			this.handleSocketMessage(data)
		}.bind(this);

		this.Socket.onclose = function () {
			console.log("socket closed")
		}
	},

	handleSocketMessage: function (data) {
		var subView = _.find(
			this.subviews('#layers'),
			function (subView) {
				return subView.layerName === data.search_term;
		});

		subView.collection.add(data);
	},

	addLoadAnimations: function () {
		var that = this;
		var searchBar = $("#search-bar");
		var controlBar = $('.leaflet-right');

		// Waits for the preloader anim to be finished
		$('body').one('bodyLoaded', function(){
			// Animate search bar in 
			searchBar.velocity({ left: "0%" }, { duration: 500 , delay: 750, 
				complete: function () {
					// Create the initial All Tweets layer
					that.addLayer( "All Tweets" )
					that.createSocket();
				}}
			)
			controlBar.velocity({ translateX: "-300px"}, { duration: 200, delay: 1150 }).show()
		 })
	},

	attachMap: function () {
		this.$('#map').html(Tweheat.mapView.$el)
	},

	search: function (event) {
		event.preventDefault();

		// Change search button to an animated icon
		var button = $('#submit-search');
		button.empty();
		button.html("<i class='fa fa-cog fa-spin'></i>")

		var searchBar = $('#search-item');
		var searchTerm = searchBar.val();
		var $error = $("<small class='error'>Only one word keyword at a time!</small>") ;

		if ( !this.validateSearchTerm( searchTerm ) ) {
			this.handleInvalidSearch( $error, searchBar )
			button.html("Search");
		} else {
			this.handleValidSearch( searchTerm, searchBar );
			this.sendSearchRequest( searchBar, button, searchTerm );
		}
	},

	validateSearchTerm: function (input) {
		var searchTerm = $.trim(input);

		//TEMP: Demo exception
		if (/All Tweets/.test(searchTerm)) { return true };

		if ( /\s/.test(searchTerm) || searchTerm === "" ) {
			return false
		} else {
			return true
		}
	}, 

	handleInvalidSearch: function ($error, searchBar) {
		searchBar.parent().addClass("error");
		searchBar.addClass("error");
		searchBar.nextAll().remove();

		$('.row.collapse').velocity("callout.bounce", 250, function() {
			searchBar.after( $error )
			$error.velocity( "transition.slideDownIn", 100 );
			$(".layer").velocity( "callout.pulse", { stagger: 50 } )		
		})
	},

	handleValidSearch: function (searchTerm, searchBar) {
		// Remove error class from search bar
		searchBar.parent().removeClass("error");
		searchBar.removeClass("error");

		// Remove error notifications
		var errors = searchBar.nextAll();
		errors.velocity("transition.slideUpOut", 200).remove();;
	},

	sendSearchRequest: function (searchBar, button, searchTerm) {
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
				that.addLayer(searchTerm);
				button.html("Search");
			}
		});		
	},

	addLayer: function (search_term) {
		// TEMP: exclude colors that are already in play
		this.zIndex++;
		var that = this;

		_.each( this.subviews('#layers'), function (view) {
			view.removeHeat( that.chooseGradient() );
		})

		var collection = new Tweheat.Collections.Tweets();

		var subView = new Tweheat.Views.LayerCard({
			layerName: search_term, 
			zIndex: this.zIndex,
			collection: collection
		});

		this.addSubview("#layers", subView);

		var $layerEl = subView.render().$el;

		$("#layers").append($layerEl)
		$layer = $layerEl.find(".layer");
		$layer.show().velocity("transition.slideDownIn", 200);

		this.heatLayers.push(subView.heatLayer._leaflet_id)

		$layer.on( "layerIsolate", this.toggleIsolate.bind(this) )
		$layer.on( "destroyLayer", this.destroySubview.bind(this) )

	}, 

	destroySubview: function (event) {
		event.stopPropagation();

		var that = this;
		var layerName = $(event.currentTarget).attr("data-id");

		// TEMP: Should only be able to create one layer per search term
		var subView = _.find(
			this.subviews('#layers'),
			function (subView) {
				return subView.layerName === layerName;
		});

		subView.$el.find(".layer").velocity("transition.slideUpOut", 200, function () {
			// Destroy view once the animation is over
			subView.destroyView();
			that.removeSubview('#layers', subView);

			// Add an All Tweets layer if no layers remain
			if ( $('#layers').children().length < 1 ) {
				that.addLayer( "All Tweets" )
			};
		})

		var index = this.heatLayers.indexOf(subView.heatLayer._leaflet_id)
		if (index > -1) {
  		this.heatLayers.splice(index, 1);
		}					

		this.zIndex--
	},

	toggleBlurMap: function (event) {
		$('.leaflet-overlay-pane').toggleClass("blur");
		$('.leaflet-layer').toggleClass("blur");
	},

	toggleIsolate: function (event) {
		var that = this;
		var curLayerID = parseInt($(event.currentTarget).attr("data-id"));

		_.each( that.subviews('#layers'), function (subView) {
				if ( subView.layerID !== curLayerID ) {
					if ( subView.isolated ) {
						subView.toggleIsolate();
					}
					if ( subView.showingLayer ) {
						subView.toggleOpacity("undefined");
					}
					subView.$el.find('div.opacity').off( "click", "**" );

				} else {
					console.log("should be toggling")
					subView.toggleIsolate();
				}
		});
	
	},

	chooseGradient: function () {
		var randomHue = function getRandomArbitrary(min, max) {
		  return Math.floor( Math.random() * (max - min) + min );
		}

		var hexColor = Please.make_color({ 
			hue: randomHue( 17, 320 ),
			saturation: 1, 
			value: 1,
			golden: false,
			format: 'hsv'
		})

		if ( this.lastColor ) {
			if ( Math.abs( this.lastColor - hexColor[0].h ) < 30) {
				this.chooseGradient();
			};
		};

  	// var hexColor = "#" + Math.floor(Math.random()*16777215).toString(16);
		this.lastColor = hexColor[0].h; 

		var hslColor = "hsl(" + this.lastColor + ", 100%, 100%)"

  	return { 1: hslColor };
	}, 


})