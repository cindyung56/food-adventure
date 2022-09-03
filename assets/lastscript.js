var rowEl = document.querySelector("row");
var resturantEl = document.querySelector("resturant");
var btnEl = document.querySelector("btn");
var reviewsEl = document.querySelector("reviews");
var view;

var directionsService;
var directionsDisplay;

var yelpApiKey =
  "tilQS7iQb9uT4oDutOHFo7mguhA3WFGZJO8uiT3DWXhR59mn0QAaXi4kCwjEUwt2EeSftvh_vLt_YA5QiOxU7xPlxy_mYk9ZdpXzKSUrpL3iv3OAvt5AJxX4KHcOY3Yx";
var destinationData;
var destinationID;


// gets the restaurant-specific ID from the parameters passed from location redirect
function getDestinationID(){
    var searchParamsArr = document.location.search.split("&");
    // console.log(searchParamsArr);
    destinationID = searchParamsArr[0].split("=").pop();
    // console.log(destinationID);
}


//displays the imagelink and phone number of choosen resturant in previos page
function restaurantSelected() {
    var yelpApiUrl = 
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + destinationID;
    //TODO: this URL is currently set to a specific location but should be based off of whichever business we chose in the previous page
    fetch(yelpApiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + yelpApiKey,
          },
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        // console.log(data);
        destinationData = data;
        console.log(destinationData);
    })
}

//Adds marker
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
    console.log(lat,lng);
    var marke1 = addMaker({lat,lng}, map);
    marke1.setAnimation(google.maps.Animation.DROP) ;
    marke1.setMap(map);
    console.log(marke1);
    var marke2 = addMaker({lat:34.052235,lng:-118.243683}, map);
    marke2.setAnimation(google.maps.Animation.DROP) ;
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    let destination = new google.maps.LatLng( 34.052235,  -118.243683);

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

}

//container displaying reviews about the resturant from yelp or google reviews.
function review() {

}
$(document).ready(function(){
    mylocation();
})


// ADDEVENTLISTENERS
//btnEl.addEventListener("click", getLocation)
getDestinationID();
restaurantSelected();