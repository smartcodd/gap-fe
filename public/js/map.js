$(function () {

  function initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          var mapCanvas = document.getElementById('map');
          var mapOptions = {
            center: location,
            zoom: 16,
            panControl: true
          }
          var map = new google.maps.Map(mapCanvas, mapOptions);
          var markerImage = 'marker.png';
          var marker = new google.maps.Marker({
            position: location,
            map: map
          });
          var contentString = '<div class="info-window">' +
            '<h3>Info Window Content</h3>' +
            '<div class="info-content">' +
            '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>' +
            '</div>' +
            '</div>';

          var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 400
          });

          marker.addListener('click', function () {
            infowindow.setContent(this.html);
            infowindow.open(map, marker);
            map.setCenter(this.getPosition());
            map.setZoom(10);
          });
        }, function (err) {
          console.log(err)
        }, {
          maximumAge: 75000,
          timeout: 15000
        });
      // Código de la aplicación
    }
    else {
      // No hay soporte para la geolocalización: podemos desistir o utilizar algún método alternativo
    }




  }

  google.maps.event.addDomListener(window, 'load', initMap);
});