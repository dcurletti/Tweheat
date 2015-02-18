window.Tweheat = {
	Models: {},
	Collections: {}, 
	Views: {}, 
	Routers: {}, 
	Utils: {}, 
	initialize: function () {

		//Top Level access so that all subviews can access the Mapbox Layers
		this.mapView = new Tweheat.Views.MapShow();

		//Top level access so that all layered subviews can access the stream
		// this.twitterStream = new EventSource("/tweets/stream");
		

		// this.dispatcher = new WebSocketRails( url );
		// debugger

		// this.dispatcher.on_open = function(data) {
		// 	console.log( "Lets ride: " + url )
		// }




		this.router = new Tweheat.Routers.Router({
			rootEl: "#main"
		});

		Backbone.history.start();
	}
}


$(document).ready(function(){
	Tweheat.initialize();
	
	var $body = $('body');
	$body.one("mapLoaded", function (event) {
		setTimeout( function () {
			$body.addClass('loaded').trigger("bodyLoaded");
	}, 1000)
	})	

	// $('body').addClass('loaded').trigger("bodyLoaded");

})