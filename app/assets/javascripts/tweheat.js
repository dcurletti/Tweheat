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
	
	var $body = $('body');
	$body.one("mapLoaded", function (event) {
		setTimeout( function () {
			$body.addClass('loaded').trigger("bodyLoaded");
	}, 1000)
	})	

	// $('body').addClass('loaded').trigger("bodyLoaded");

	// TEMP: Might want to refactor this into the overall game template
	window.onbeforeunload = function(){
		Tweheat.dispatcher.trigger('new_message', { something: "lala"})
	}

	$('#test').on('click', function (event) {
		console.log('click');
		Tweheat.dispatcher.trigger('new_message', {something: 'hellsyea'});
	})

	Tweheat.dispatcher.on_close = function(data) {
  	return console.log('on close');
	};

	channel = Tweheat.dispatcher.subscribe('test')
	channel.bind('new', function(msg) {
		console.log(msg)
	})

})