Tweheat.Routers.Router = Backbone.Router.extend({

	initialize: function () {
		this.$rootEl = $(options.rootEl)
	},

	routes: {
		'': 'mapIndex'
	},

	mapIndex: function () {
		var view = new Tweheat.Views.SearchShow({});
		
		this.$rootEl.html(view.render().$el)
	}

})