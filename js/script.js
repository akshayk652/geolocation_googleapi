
/* 
 Name : Get nearby places.
 Description : Ask user for current location and display nearby bus stations, theaters and shopping malls using google api.
*/ 

var x = document.getElementById("location")
// Initialize geolocation/get user location.
function initialize() {
    let pos;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      x.innerHTML = "Browser Doesn't support Geolocation!";
    }
   // Get current position.
    function showPosition(position) {
         pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
      myMap();
    } 

    function showError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
          case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
          case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
          case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
        }
      }
    // Iitialize map.
    function myMap() {
        map = new google.maps.Map(document.getElementById("map"), {
        center: pos,
        zoom: 17
      });
   
      let currPosition = new google.maps.Marker({
        map: map,
        position: pos
      });
   
    // Displaying info on window. 
      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      
      service.nearbySearch(
        {
          location: pos,
          radius: 500,
          type: ["movie_theater"]
        },
        callback
      );
      service.nearbySearch(
        {
          location: pos,
          radius: 500,
          type: ["shopping_mall"]
        },
        callback
      );
      service.nearbySearch(
        {
          location: pos,
          radius: 500,
          type: ["bus_station"]
        },
        callback
      );
    }
   }
   
  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
   }
   // Create markers/icons for various places.
   function createMarker(place) {
    placesList = place.types;
    for(i = 0; i < placesList.length; i++){
        if(placesList[i] == "shopping_mall")
            img = "./images/shopping-cart-128.png";
        else if(placesList[i] == "bus_station")
            img = "./images/bus_station-128.png";
        else if(placesList[i] == "movie_theater")
            img = "./images/video-record-film-movie-128.png";
    }
    
    var icon = {
      url: img,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
   
    var marker = new google.maps.Marker({
      map: map,
      icon: icon,
      position: place.geometry.location
    });

    // Display Name of the clicked place.
    google.maps.event.addListener(marker, "click", function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
   }