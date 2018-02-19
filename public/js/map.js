$(function () {
  var trans = {
    Geolocation: "Geolocalización:",
    Latitude: "Latitud:",
    Longitude: "Longitud:",
    NoResolvedAddress: "Sin dirección resuelta"
  };
  var geocoder;
  var timeoutMap;
  var map;
  var infowindow = new google.maps.InfoWindow;
  var marker = null;
  var elevator;
  var fromPlace = 0;
  var locationFromPlace;
  var addressFromPlace;
  var placeName;
  var myOptions = {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  function initMap() {
    var $contectMap = document.getElementById("map");
    if ($contectMap != undefined) {
      map = new google.maps.Map($contectMap, myOptions);


      var options = {};
      geocoder = new google.maps.Geocoder;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            marker = new google.maps.Marker({
              map: map,
              position: pos
            });
            map.setCenter(pos);

            geocoder.geocode({
              latLng: pos
            }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  if (marker != null)
                    marker.setMap(null);
                  marker = new google.maps.Marker({
                    position: pos,
                    map: map
                  });
                  var infoText = "<strong>" + trans.Geolocation + '</strong> <span id="geocodedAddress">' + results[0].formatted_address + "</span>";
                  infowindow.setContent(infowindowContent(infoText, position.coords.latitude, position.coords.longitude));
                  infowindow.open(map, marker);
                }
              } else {
                if (marker != null)
                  marker.setMap(null);
                marker = new google.maps.Marker({
                  position: pos,
                  map: map
                });
                var infoText = "<strong>" + trans.Geolocation + '</strong> <span id="geocodedAddress">' + trans.NoResolvedAddress + "</span>";
                infowindow.setContent(infowindowContent(infoText, position.coords.latitude, position.coords.longitude));
                infowindow.open(map, marker);
              }

            }, { location_type: { RANGE_INTERPOLATED: '' } });
           
          }, function (err) {
            console.log(err);
          }, {
            maximumAge: 75000,
            timeout: 15000
          });

      }
    }
  }

  

  

  function infowindowContent(text, latres, lngres) {
    return '<div id="info_window">' + text + "<br/><strong>" + trans.Latitude + "</strong> " + Math.round(latres * 1e6) / 1e6 + " | <strong>" + trans.Longitude + "</strong> " + Math.round(lngres * 1e6) / 1e6 + "<br/><br/></div>";
  }

  google.maps.event.addDomListener(window, 'load', initMap);
});