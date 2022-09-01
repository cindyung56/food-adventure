var rowEl = document.querySelector("row")
var resturantEl = document.querySelector("resturant")
var mapEl = document.getElementById(".map")
var btnEl = document.querySelector("btn")
var reviewsEl = document.querySelector("reviews")

//displays the imagelink and phone number of choosen resturant in previos page
function restaurantSelected() {
    
}

function initMap(){
    var options = {
        zoom:10,
        center:{lat:50.0000,lng:-81.0000}
    }

    //new map
    var map = new google.maps.Map(document.querySelector("map"), options);
    
}

//pin ponts the locatin of the selected resturants
function locatin() {
    const view = location 
//pin point
    // const mapping = map google.mapS.Maps(document.getElementById(".map"), {
    //     zoom: 4,
    //     center: view,
    // });
    // const maker = new google.maps.Maker({
    // position: view,
    // map: map,
    // })
}

//button when clicked redirects you to google maps
function directions() {

}

//container displaying reviews about the resturant from yelp or google reviews.
function review() {

}

// ADDEVENTLISTENERS
btnEl.addEventListener("click", getLocation)