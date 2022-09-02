var resturantEl = document.querySelector("resturant")
var btnEl = document.querySelector("btn")
var reviewsEl = document.querySelector("reviews")
var view;
var testUrl = "https://www.google.com/maps/dir/";; 
var directionsService;
var directionsDisplay;

//displays the imagelink and phone number of choosen resturant in previos page
function restaurantSelected() {

    
}

//Adds and positions the marker
function addMaker(location, map) {
    console.log(location)
    let destination = new google.maps.LatLng(location.lat,location.lng)

    var marker = new google.maps.Marker({
        postion:destination,
        map:map,
        title: "You are HERE",
     })
     return marker
}

// determins what map is being used and the destination
function initMap(pos, lat, lng){ 
    
    var map = new google.maps.Map(document.querySelector("#map"), {
        center: pos,
        zoom:12
    });
    console.log(lat,lng)
    var marke1 = addMaker({lat,lng}, map)
    marke1.setAnimation(google.maps.Animation.DROP) ;
    marke1.setMap(map)
    console.log(marke1)
    var marke2 = addMaker({lat:34.052235,lng:-118.243683}, map)
    marke2.setAnimation(google.maps.Animation.DROP) ;
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    let destination = new google.maps.LatLng( 34.052235,  -118.243683)

    let request = {
        origin: {lat,lng},
        destination: {lat:34.052235,  lng:-118.243683},
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService
    .route(request)
    .then((response)=>{

        directionsDisplay.setDirections(response);
    })
}

//pin points the users location 
function mylocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
    //view.innerHTML = {lat:position.coords.latitude, lng:position.coords.longitude}
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    initMap(pos, position.coords.latitude, position.coords.longitude);
    });
}

//button when clicked redirects you to google maps
function directions() {
    testUrl 
     
}

//container displaying reviews about the resturant from yelp or google reviews.
function review() {

}
$(document).ready(function(){
   mylocation()
})


// ADDEVENTLISTENERS
btnEl.addEventListener("click", getLocation)