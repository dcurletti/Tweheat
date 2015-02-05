Tweheat.Routers.Router = Backbone.Router.extend({

	initialize: function (options) {
		this.$rootEl = $(options.rootEl)
	},

	routes: {
		'': 'mapIndex'
	},

	mapIndex: function () {
		var view = new Tweheat.Views.SearchShow({});
		
		this.$rootEl.append(view.render().$el)
	}

})