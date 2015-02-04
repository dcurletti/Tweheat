$(function() {

  //Listener for Tweets from the server
  source = new EventSource("/tweets/stream");

  var startingPosition = [37.8304718, -122.2794226]
  var startingZoom = 13

  L.mapbox.accessToken = 'pk.eyJ1IjoiZGN1cmxldHRpIiwiYSI6IkpYT1NXb1UifQ.3VKg9h5-Aoxmk9e1yROPmQ';

  var map = L.mapbox.map('map', 'dcurletti.knl7n7kb').setView(startingPosition, startingZoom);

  L.control.locate().addTo(map);

  // source.addEventListener('tweet', function (event) {
  //   data = $.parseJSON(event.data);
    
  //   $('.tweets').prepend('<p>' + data.content + "</p>")
  // })

  // Credit Foursquare for their wonderful data
  // map.attributionControl
      // .addAttribution('<a href="https://foursquare.com/">Places data from Foursquare</a>');

  // Foursquare credentials
  var CLIENT_ID = '1PPLSVNFRDYXS0Z1SFHHTYI2XQIJX0NRE5OSOJJHUMPQYNS4';
  var CLIENT_SECRET = 'EJG2EKFYFW4ICBTVTNQU2EXAXFFOMLHQRESYAAP1DPCATCGZ';

  // Foursquare API parameters
  var searchLimit = 30
  var currentSW = map.getBounds().getSouthWest();
  var currentNE = map.getBounds().getNorthEast();
  console.log("This is the currentSW " + JSON.stringify(currentSW));
  console.log("This is the currentNE " + JSON.stringify(currentNE));

  // https://developer.foursquare.com/start/search
  var API_ENDPOINT = 'https://api.foursquare.com/v2/venues/search' +
    '?client_id=CLIENT_ID' +
    '&client_secret=CLIENT_SECRET' +
    '&v=20130815' +
    '&query=sports_bar' +
    '&categoryId=4bf58dd8d48988d11d941735' + 
    '&intent=browse' +
    '&sw=currentSW' +
    '&ne=currentNE' +
    '&limit=SEARCHLIMIT' +
    '&callback=?';

  // Keep our place markers organized in a nice group.
  var foursquarePlaces = L.layerGroup().addTo(map);
  var heat = L.heatLayer([], { maxZoom: 9, radius: 15, blur: 14,   } ).addTo(map);
  var heat2 = L.heatLayer([], { maxZoom: 9, radius: 7, blur: 10, gradient: {1: 'red'} }).addTo(map);

  // Use jQuery to make an AJAX request to Foursquare to load markers data.
  $.getJSON(API_ENDPOINT
      .replace('CLIENT_ID', CLIENT_ID)
      .replace('CLIENT_SECRET', CLIENT_SECRET)
      .replace('currentSW', currentSW.lat + ',' + currentSW.lng)
      .replace('currentNE', currentNE.lat + ',' + currentNE.lng)
      .replace('SEARCHLIMIT', searchLimit)
      , function(result, status) {

      console.log(API_ENDPOINT);
      console.log(result, status)
      if (status !== 'success') return alert('Request to Foursquare failed');

      // Transform each venue result into a marker on the map.
      for (var i = 0; i < result.response.venues.length; i++) {
        var venue = result.response.venues[i];
        var latlng = L.latLng(venue.location.lat, venue.location.lng);
        // var marker = L.marker(latlng, {
        //     icon: L.mapbox.marker.icon({
        //       'marker-color': '#BE9A6B',
        //       'marker-symbol': 'basketball',
        //       'marker-size': 'large'
        //     })
        //   })
        // .bindPopup('<strong><a href="https://foursquare.com/v/' + venue.id + '">' +
        //   venue.name + '</a></strong>' + '<p>Number: ' + i + ' </p>')
        //   .addTo(foursquarePlaces);
        console.log(latlng)
        if (i % 2 === 0) {heat.addLatLng(latlng);} else {
          heat2.addLatLng(latlng);
        }
        
      }

  });

});