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
		var url = "wss://" + window.location.host + '/websocket';

		// this.dispatcher = new WebSocketRails( url );
		var ws = new WebSocket( url );
		ws.onopen = function()
		{
		  // Web Socket is connected, send data using send()
		  ws.send("Message to send");
		  console.log("opened connection")
		  // alert("Message is sent...");
		};
		ws.onmessage = function (evt) 
		{ 
		  var received_msg = evt.data;
		  console.log(received_msg)
		};
		ws.onclose = function()
		{ 
		  // websocket is closed.
		  alert("Connection is closed..."); 
		};




		//TEMP: 
		console.log( "Establishing websocket connection on: " + url )

		this.router = new Tweheat.Routers.Router({
			rootEl: "#main"
		});

		Backbone.history.start();
	}
}


$(document).ready(function(){
	Tweheat.initialize();
})