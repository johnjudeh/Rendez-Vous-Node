let map, infoWindow, pos;
let locations = [
  {lat: 40.4648329 - (0.001640624 * Math.pow(2, 4)), lng: 50.0521075}
  // {lat: 40.4648329, lng: 50.0521075}
];
let locateButton = document.querySelector('.locateButton');

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.5007, lng: -0.12406},
    zoom: 12
  });
}

function initMapGeo() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.5007, lng: -0.12406},
    zoom: 12
  });

  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      locations.push(pos);
      createMarkerClusterer();

      let midPoint = getMidPoint(locations);
      let zoomLevel = getZoomLevel(locations);

      console.log(zoomLevel);
      console.log(pos);

      map.setCenter(midPoint);
      map.setZoom(zoomLevel);

    }, () => {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function createMarkerClusterer(){
  // Marker clusters
  let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let markers = locations.map((location, i) => {
    return new google.maps.Marker({
      position: location,
      label: labels[i % labels.length]
    });
  })

  let markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

function getMidPoint(locations) {
  let lats = []
  let lngs = [];
  let avgCoords = {};

  locations.forEach((location) => {
    lats.push(location.lat);
    lngs.push(location.lng);
  });

  avgCoords.lat = average(lats)
  avgCoords.lng = average(lngs)

  return avgCoords;
}

function average(arr) {
  let sum = 0;
  for (index of arr) {
    sum += index;
  }
  return sum / arr.length;
}

function getZoomLevel(locations) {

  const increment = 0.001640625;
  const zoomLevels = [
    18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
  ];

  let maxLat, minLat, maxLng, minLng;
  let latRange, lngRange, maxRange, zoomIndex, zoomLevel;
  let lats = []
  let lngs = [];

  locations.forEach((location) => {
    lats.push(location.lat);
    lngs.push(location.lng);
  });

  maxLat = Math.max(...lats);
  minLat = Math.min(...lats);
  maxLng = Math.max(...lngs);
  minLng = Math.min(...lngs);

  latRange = maxLat - minLat;
  lngRange = maxLng - minLng;
  maxRange = Math.max(latRange, lngRange);

  zoomIndex = Math.round((Math.log(maxRange) - Math.log(increment)) / Math.log(2));

  if (zoomIndex <= 17) {
    zoomLevel = zoomLevels[zoomIndex];
  } else {
    zoomLevel = 1;
  }

  return zoomLevel;
}

locateButton.addEventListener('click', () => {
  const initScript = document.getElementById('initialMap');
  document.body.removeChild(initScript);

  let scriptMap = document.createElement('script');
  scriptMap.async = true;
  scriptMap.defer = true;
  scriptMap.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCSV5BXC93ll0igbOw23qAAzyEjN84KtPk&callback=initMapGeo&libraries=places';

  let scriptMarkerCluster = document.createElement('script');
  scriptMarkerCluster.src = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js'

  document.body.appendChild(scriptMarkerCluster);
  document.body.appendChild(scriptMap);
});

/* Notes

Works based on height not width so sometimes width seperation uses a
zoom level that is too low (no easy fix)

0.001640625   -   Zoom 18 (used as increment)
0.015 -   Zoom 15
0.03  -   Zoom 14
0.06  -   Zoom 13
0.12  -   Zoom 12
0.21  -   Zoom 11
0.42  -   Zoom 10

*/
