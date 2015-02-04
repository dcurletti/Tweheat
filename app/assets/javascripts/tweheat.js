window.Tweheat = {
	Models: {},
	Collections: {}, 
	Views: {}, 
	Routers: {}, 
	Utils: {}, 
	initialize: function () {

		this.mapView = new Tweheat.Views.MapShow();

		this.router = new Tweheat.Routers.Router({
			rootEl: topMostDiv
		});

		Backbone.history.start();
	}
}


$(document).ready(function(){
	Tweheat.initialize();
})