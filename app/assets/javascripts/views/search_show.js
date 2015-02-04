Tweheat.Views.SearchShow = Backbone.View.extend({

	className: 'search-show',

	template: JST['index'],

	attachMap: function () {
		this.$('#map').html(Tweheat.mapView.$el)
	},

	render: function () {
		var renContent = this.template({});

		this.$el.html(renContent);

		return this;
	}

})