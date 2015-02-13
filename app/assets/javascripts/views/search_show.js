	Tweheat.Views.SearchShow = Backbone.CompositeView.extend({
	className: 'search-show',

	events: {
		'submit form': 'search',
		'click .destroy': 'destroySubview'
		// 'focusin input': 'toggleBlurMap',
		// 'focusout input': 'toggleBlurMap'
	},

	template: JST['index'],

	initialize: function () {
		this.zIndex = 0;
		this.heatLayers = []
	},

	render: function () {
		this.attachMap();

		var renContent = this.template({});
		this.$el.append(renContent);
		
		this.addLoadAnimations();
		return this;
	},

	addLoadAnimations: function () {
		var that = this;
		var searchBar = $("#search-bar");

		// Waits for the preloader anim to be finished
		$('body').on('bodyLoaded', function(){
			// Animate search bar in 
			searchBar.velocity({ left: "0%" }, { duration: 500 , delay: 750, 
				complete: function () {
					// Create the initial All Tweets layer
					that.addLayer( "All Tweets" )
				}}
			)
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

		_.each( this.subviews('#layers'), function (view) {
			view.removeHeat();
		})

		var subView = new Tweheat.Views.LayerCard({
			layerName: search_term, 
			zIndex: this.zIndex,
		});

		this.addSubview("#layers", subView);

		var $layerEl = subView.render().$el;

		$("#layers").append($layerEl)

		$layerEl.find(".layer").show().velocity("transition.slideDownIn", 200);

		this.heatLayers.push(subView.heatLayer._leaflet_id)

	}, 

	destroySubview: function (event) {
		event.stopPropagation();
		
		var that = this;
		var layerName = $(event.currentTarget).attr("data-id");

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
	}

})