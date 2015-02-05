Tweheat.Views.SearchShow = Backbone.View.extend({

	className: 'search-show',

	template: JST['index'],

	attachMap: function () {

		this.$('#map').html(Tweheat.mapView.$el)

	},

	render: function () {
		this.attachMap();

		var renContent = this.template({});

		this.$el.append(renContent);

		return this;
	}

})