var rowEl = document.querySelector(".row");
var resturantEl = document.querySelector(".resturant");
var btnEl = document.querySelector(".btn");
var reviewsEl = document.querySelector(".reviews");
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
    destinationID = searchParamsArr[0].split("=").pop();
    restaurantSelected();
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
        addRestaurantInfo();
        getReviews();
        mylocation();
    })
}

// add restaurant information to page
function addRestaurantInfo(){
    $('#restaurant-title').text(destinationData.name);
    var destinationPhoneNumber = destinationData.display_phone;
    $('.call').attr("href", "tel:"+ destinationPhoneNumber);
    resturantEl.textContent = "";
    resturantEl.innerHTML = "<img src=" + destinationData.image_url + " alt='image of restaurant'>";
}

//Adds marker
function addMarker(location, map) {
    console.log(location);
    let destination = new google.maps.LatLng(location.lat,location.lng)

    var marker = new google.maps.Marker({
        position:destination,
        map:map,
        title: "You are HERE",
     });
     return marker;
}

// determines what map is being used and the destination
function initMap(pos, lat, lng){ 
    
    var map = new google.maps.Map(document.querySelector("#map"), {
        center: pos,
        zoom:12
    });

    var marke1 = addMarker({lat,lng}, map);
    marke1.setAnimation(google.maps.Animation.DROP) ;
    marke1.setMap(map);

    var destinationLatitude = destinationData.coordinates.latitude;
    var destinationLongitude = destinationData.coordinates.longitude;

    var marke2 = addMarker({lat: destinationLatitude, lng: destinationLongitude}, map);
    marke2.setAnimation(google.maps.Animation.DROP) ;

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    let destination = new google.maps.LatLng( destinationLatitude,  destinationLongitude);

    let request = {
        origin: {lat,lng},
        destination: {lat:destinationLatitude,  lng:destinationLongitude},
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
    // console.log("My current position is: " + position.coords.latitude + ", " + position.coords.longitude);
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    initMap(pos, position.coords.latitude, position.coords.longitude);
    
    });
}

// adds reviews into container talking about the resturant from yelp reviews
function getReviews() {
    var yelpApiUrl = 
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + destinationID + "/reviews";
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
        reviewsEl.textContent = "";
        var reviewsArray = data.reviews;

        for (var i = 0; i < reviewsArray.length; i++){
            var currentReview = reviewsArray[i];

            var reviewName = document.createElement("h3");
            reviewName.textContent = currentReview.user.name + " rated this " + currentReview.rating + " / 5 stars";
            
            var reviewText = document.createElement("p");
            reviewText.textContent = currentReview.text;
            reviewText.setAttribute("style", "font-style: italic;");

            reviewsEl.appendChild(reviewName);
            reviewsEl.appendChild(reviewText);
        }
    })
}

// redirects to Google Maps website with the destination latitude and longitude
function getLocation() {
    location.assign('https://www.google.com/maps/search/?api=1&query=' + destinationData.coordinates.latitude + ',' + destinationData.coordinates.longitude);
}

// ask user for current location upon page load
$(document).ready(function(){
    getDestinationID();

})

// EVENT LISTENERS
btnEl.addEventListener("click", getLocation)
