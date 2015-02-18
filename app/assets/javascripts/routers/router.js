Tweheat.Routers.Router = Backbone.Router.extend({

	initialize: function (options) {
		this.$rootEl = $(options.rootEl)
	},

	routes: {
		'': 'searchShow'
	},

	searchShow: function () {
		var mainView = new Tweheat.Views.SearchShow({});
		
		// this.$rootEl.append(mainView.render().$el)
		this._swapView(mainView)

		
	},

	_swapView: function (view) {
		this._currentView && this._currentView.remove();
		this._currentView = view;

		this.$rootEl.append(view.$el);
		view.render();
	}

})
