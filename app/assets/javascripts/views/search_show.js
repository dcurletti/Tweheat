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
		
		this.currentColors = [];

		this.currentLayerIndex = 1;

		this.animHack = false;
	},

	render: function () {
		this.attachMap();

		var renContent = this.template({});
		this.$el.append(renContent);
		
		this.addAnimations();

		// Create the initial All Tweets layer
		this.addLayer("All Tweets", 1)

		return this;
	},

	addAnimations: function () {
		var that = this;
		var searchBar = $("#search-bar");
		searchBar.velocity({ left: "0%" }, { duration: 500 , delay: 500, 
			complete: function () {
				$('.layer').show().velocity("transition.slideDownIn", 200);
				that.animHack = true;
			}}
		)
	},

	attachMap: function () {
		this.$('#map').html(Tweheat.mapView.$el)
	},

	search: function (event) {
		event.preventDefault();
		var searchBar = $('#search-item');
		var searchBarValue = searchBar.val();
		var siblings = searchBar.siblings();
		var $error = $("<small class='error'>Only one word keyword at a time!</small>") ;


		if (!this.validateSearchTerm(searchBarValue)) {
			searchBar.parent().addClass("error");
			searchBar.addClass("error");
			if ( siblings.length === 0 ) { 
				$('.row.collapse').velocity("callout.bounce", 250, function() {
					searchBar.after($error)
					$error.velocity("transition.slideDownIn", 100);
					$(".row.layer").velocity( "callout.pulse", { stagger: 50 } )		
				})
			}
		} else {
			searchBar.parent().removeClass("error");
			searchBar.removeClass("error");
			var errors = searchBar.nextAll();
			errors.velocity("transition.slideUpOut", 200, { 
				complete: function(){
					errors.remove();
				}
			});

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
					that.addLayer(searchBarValue, 1)
				}
			});
		}

	},

	validateSearchTerm: function (input) {
		var searchTerm = $.trim(input);
		if (/All Tweets/.test(searchTerm)) { return true };

		if (/\s/.test(searchTerm)) {
			return false
		} else {
			return true
		}
	}, 

	addLayer: function (search_term, zIndex) {
		// TEMP: exclude colors that are already in play
		var color = this.randomColor();

		var subView = new Tweheat.Views.LayerCard({
			layerName: search_term, 
			zIndex: zIndex,
			color: color
		});

		this.addSubview("#layers", subView);

		var $layerEl = subView.render().$el;

		$("#layers").append($layerEl)

		if (this.animHack) {
			$layerEl.find(".layer").show().velocity("transition.slideDownIn", 200);
		};

	}, 

	randomColor: function () {
  	return Math.floor(Math.random()*16777215).toString(16);
	}, 

	destroySubview: function (event) {
		var layerName = $(event.currentTarget).attr("data-id");

		var subView = _.find(
			this.subviews('#layers'),
			function (subView) {
				return subView.layerName === layerName;
		});

		subView.$el.find(".layer").velocity("transition.slideUpOut", 200)

		subView.destroyView();

		this.removeSubview('#layers', subView);

	},

	toggleBlurMap: function (event) {
		$('.leaflet-overlay-pane').toggleClass("blur");
		$('.leaflet-layer').toggleClass("blur");
	}

		// Tweheat.dispatcher.trigger('client_connected', task);


	// test: function (event) {
	// 	Tweheat.dispatcher.trigger('')
	// }

})