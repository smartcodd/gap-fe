
$(function () {
  var trans = {
    DefaultLat: 40.7127837,
    DefaultLng: -74.0059413,
    DefaultAddress: "New York, NY, USA",
    Geolocation: "Geolocalización:",
    Latitude: "Latitud:",
    Longitude: "Longitud:",
    GetAltitude: "Obtener Altitud",
    NoResolvedAddress: "Sin dirección resuelta",
    GeolocationError: "Error de geolocalización.",
    GeocodingError: "Error de codificación geográfica: ",
    Altitude: "Altitud: ",
    Meters: " metros",
    NoResult: "No result found",
    ElevationFailure: "Elevation service failed due to: ",
    SetOrigin: "Establecer como origen",
    SetDestination: "Establecer como destino",
    Address: "Dirección: ",
    Bicycling: "En bicicleta",
    Transit: "Transporte público",
    Walking: "A pie",
    Driving: "En coche",
    Kilometer: "Kilómetro",
    Mile: "Milla",
    Avoid: "Evitar",
    DirectionsError: "Calculating error or invalid route.",
    North: "N",
    South: "S",
    East: "E",
    West: "O",
    Type: "tipo",
    Lat: "latitud",
    Lng: "longitud",
    Dd: "GD",
    Dms: "GMS",
    CheckMapDelay: 7e3
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
  var defaultLatLng = new google.maps.LatLng(trans.DefaultLat, trans.DefaultLng);
  var myOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var mapLoaded = 0;

  function initMap() {
    if (document.getElementById("map") != undefined) {
      map = new google.maps.Map(document.getElementById("map"), myOptions);
      var options = {};
      geocoder = new google.maps.Geocoder;
      setTimeout(checkMap, trans.CheckMapDelay);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log(position.coords)
            marker = new google.maps.Marker({
              map: map,
              position: pos
            });
            map.setCenter(pos);
            mapLoaded = 1;
            geocoder.geocode({
              latLng: pos
            }, function (results, status) {
              console.log(results);
              console.log(status);
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  console.log(position.coords)
                  if (marker != null)
                    marker.setMap(null);
                  marker = new google.maps.Marker({
                    position: pos,
                    map: map
                  });
                  console.log(marker)
                  console.log(results[0].formatted_address)
                  var infoText = "<strong>" + trans.Geolocation + '</strong> <span id="geocodedAddress">' + results[0].formatted_address + "</span>";
                  infowindow.setContent(infowindowContent(infoText, position.coords.latitude, position.coords.longitude));
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
              }
            }, { location_type: { RANGE_INTERPOLATED: '' } })
          }, function (err) {
            defaultMap()
          }, {
            maximumAge: 75000,
            timeout: 15000
          });
      }
      else {
        defaultMap()
      }
    }
  }
  function infowindowContent(text, latres, lngres) {
    return '<div id="info_window">' + text + "<br/><strong>" + trans.Latitude + "</strong> " + Math.round(latres * 1e6) / 1e6 + " | <strong>" + trans.Longitude + "</strong> " + Math.round(lngres * 1e6) / 1e6 + '<br/><br/><span id="altitude"><button type="button" class="btn btn-primary" onclick="getElevation()">' + trans.GetAltitude + "</button></span></div>"
  }
  function checkMap() {
    if (mapLoaded == 0) {
      defaultMap()
    }
  }
  function defaultMap() {
    map.setCenter(defaultLatLng);
    mapLoaded = 1;

    if (marker != null) marker.setMap(null);
    marker = new google.maps.Marker({
      map: map,
      position: defaultLatLng
    });
    infowindow.setContent(infowindowContent(trans.DefaultAddress, defaultLatLng.lat(), defaultLatLng.lng())); infowindow.open(map, marker);

  }
  google.maps.event.addDomListener(window, 'load', initMap);
});