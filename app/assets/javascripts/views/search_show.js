Tweheat.Views.SearchShow = Backbone.View.extend({

	className: 'search-show',

	events: {
		'submit form' : 'search'
	},

	template: JST['index'],

	attachMap: function () {

		this.$('#map').html(Tweheat.mapView.$el)

	},

	render: function () {
		this.attachMap();

		var renContent = this.template({});

		this.$el.append(renContent);

		return this;
	},

	search: function (event) {
		event.preventDefault();
		console.log(event.currentTarget);
	}

})