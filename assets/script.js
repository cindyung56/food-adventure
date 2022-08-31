//Define user preference variables
var userPreference;
var testUrl = 'https://thezipcodes.com/api/v1/search?zipCode=13040&countryCode=US&apiKey=bb5257b61f84cbecea9a7c62f342c081'
var userAddressInput = $('');
var userAddressInputBtn = $('');
var yelpApiKey;
var latitude;
var longitude;

//Prompt the user to get their location data or have them enter address/zip code
function getUserLocation() {
    var zipCodeApiUrl = 'https://thezipcodes.com/api/v1/search?zipCode='
    if(isNaN(userAddressInput.val()) || userAddressInput.val().length > 5) {/*TODO add display to say they must enter a number*/return 0;}
    

    zipCodeApiUrl = zipCodeApiUrl + userAddressInput.val() + '&countryCode=US&apiKey=bb5257b61f84cbecea9a7c62f342c081';

    fetch(zipCodeApiUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            latitude = data.location[0].latitude;
            longitude = data.location[0].longitude;
            console.log(latitude + '\n' + longitude);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

}
//Random button calls this function on click using the API -- chooses 3 restaurants
//TODO make it so only restaurants open now are chosen
//TODO add a list of random search terms (e.g. deli, thai, indian, mexican, burgers)
//TODO have the list change with preferences
function pickRandRestaurants() {
    var yelpApiUrl = 'https://api.yelp.com/v3/businesses/search?term=delis&per-page=10&latitude=';
    //have a list of search terms and randomize them

    yelpApiUrl = yelpApiUrl + latitude + '&longitude=' + longitude;

    fetch(yelpApiUrl, {
        method: 'GET', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + yelpApiKey,
        },
        })
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

//Get the preferences from local storage and store them in the global variables
function getPreferences() {

}

//Store the user preferences (allergies, location, cost)
function storePreferences() {

}

//Populates the empty div container with the result from the API call
function presentRestaurants() {

}

//Clear the div container
function clearContainer() {

}

//If they click on the restaurant, save the restaurant data in the URL and go to new page where more information is shown and mapping can be done
function restaurantNewPage() {

}

//Event listeners
userAddressInputBtn.on('click', getUserLocation);

