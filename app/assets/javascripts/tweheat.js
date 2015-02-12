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
		//TEMP: refactor
		
		var deliveryMethod = "ws://"
		if (!window.location.host === "localhost:3000") {
			deliveryMethod = "wss://"
		};

		var url = deliveryMethod + window.location.host + '/websocket';

		this.dispatcher = new WebSocketRails( url );

		//TEMP: 
		console.log( "Lets ride: " + url )

		this.router = new Tweheat.Routers.Router({
			rootEl: "#main"
		});

		Backbone.history.start();
	}
}


$(document).ready(function(){
	Tweheat.initialize();

	setTimeout( function () {

		$('body').addClass('loaded').trigger("bodyLoaded");
		$('h1').css('color', '#222222')
		
	}, 1000)

})