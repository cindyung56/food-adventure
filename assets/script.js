//shows empty div container with results from API call
//Define user preference variables
var userPreferencesBtn = $("#prefBtn");
var userAddressInput = $("#address-input");
var userAddressInputBtn = $("#address-btn");
var randomBtn = $("#randomizeBtn");

var preferencesDivEl = $("#preferences-content");

var restContainer = $(".container");

var yelpApiKey =
  "tilQS7iQb9uT4oDutOHFo7mguhA3WFGZJO8uiT3DWXhR59mn0QAaXi4kCwjEUwt2EeSftvh_vLt_YA5QiOxU7xPlxy_mYk9ZdpXzKSUrpL3iv3OAvt5AJxX4KHcOY3Yx";

var searchTerms = [
  "Sandwich",
  "Burger",
  "Thai",
  "Mexican",
  "Pho",
  "American",
  "Sushi",
  "Italian",
  "Indian",
];
var latitude;
var longitude;
var randRestaurants;
var questionIndex = 0;
var formCreate = $("<form>");

var dietaryAllergies;
var dietaryRestrictions;
var ethnicPreferences;
var budgetPreference;

var ethnicities = localStorage.key("ethnicities");

// Get the user's zip code from localStorage if previously stored
function getLocalZipCode() {
  var zipCode = localStorage.getItem("zip-code");
  if (zipCode !== null) {
    console.log("there is a saved zip code in localStorage");
    userAddressInput.prop("placeholder", zipCode);
    fetchYelpApiUrl(zipCode);
  }
}

//Prompt the user to get their location data or have them enter address/zip code
function getUserLocation(event) {
  event.preventDefault();
  if (isNaN(userAddressInput.val()) || userAddressInput.val().length > 5) {
    /*TODO add display to say they must enter a number*/
    console.log("NOT A NUMBER");
    return 0;
  }
  console.log(userAddressInput.val());

  fetchYelpApiUrl(userAddressInput.val());
}

function fetchYelpApiUrl(userZipCode) {
  var zipCodeApiUrl = "https://thezipcodes.com/api/v1/search?zipCode=";
  zipCodeApiUrl =
    zipCodeApiUrl +
    userZipCode +
    "&countryCode=US&apiKey=bb5257b61f84cbecea9a7c62f342c081";

  fetch(zipCodeApiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success ZIP:", data);
      $(randomBtn).prop("disabled", false);
      $(userPreferencesBtn).prop("disabled", false);
      latitude = data.location[0].latitude;
      longitude = data.location[0].longitude;
      console.log(latitude + "\n" + longitude);
      localStorage.setItem("latitude", latitude);
      localStorage.setItem("longitude", longitude);
      localStorage.setItem("zip-code", userZipCode);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//Random button calls this function on click using the API -- chooses 3 restaurants
//TODO make it so only restaurants open now are chosen
//TODO add a list of random search terms (e.g. deli, thai, indian, mexican, burgers)
//TODO have the list change with preferences
function pickRandRestaurants(event) {
  event.preventDefault();
  var yelpApiUrl =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" +
    searchTerms[Math.floor(Math.random() * searchTerms.length)] +
    "&latitude=";
  //have a list of search terms and randomize them

  yelpApiUrl = yelpApiUrl + latitude + "&longitude=" + longitude;
  randRestaurants = [];

  fetch(yelpApiUrl, {
    method: "GET", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + yelpApiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success YELP:", data);
      for (var i = 0; i < data.businesses.length; i++) {
        if (!data.businesses[i].is_closed && randRestaurants.length < 3) {
          console(data.businesses[i].url);
          // console.log(data.businesses[i].url)
          randRestaurants.push(data.businesses[i]);
        }
        if (randRestaurants < 3) {
          notEnoughOpen();
          return 0;
        }
      }

      presentRestaurants();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// User Preferences Questionaire
var questions = [
  // {
  //   question: "Do you have any allergies?",
  //   choices: [
  //     "Milk",
  //     "Tree nuts",
  //     "Eggs",
  //     "Peanuts",
  //     "Fish",
  //     "Wheat",
  //     "Shellfish",
  //     "Soybeans",
  //     "None",
  //   ],
  //   keyValue: "allergies",
  // },

  {
    question: "Do you have any dietary preferences/restrictions?",
    choices: ["Vegetarian", "Vegan", "Keto", "Kosher", "Gluten-Free"],
    keyValue: "preferences",
  },

  {
    question: "Which food ethnicities do you prefer?",
    choices: ["American", "Asian", "Italian", "Mexican"],
    keyValue: "ethnicities",
  },

  {
    question: "How much are you willing to spend?",
    choices: ["$", "$$", "$$$", "$$$$"],
    keyValue: "cost",
  },
];

// Display questionnaire questions and preferences
function render() {
  // clears question data/elements
  $(preferencesDivEl).empty();
  $(formCreate).empty();

  var userQuestion = questions[questionIndex].question;
  var userChoices = questions[questionIndex].choices;
  var currentKey = questions[questionIndex].keyValue;
  preferencesDivEl.text(userQuestion);

  // forEach function creates a list element for each preference option
  userChoices.forEach(function (newItem) {
    var listItem = $("<input>");
    listItem.attr({
      type: "checkbox",
      value: newItem,
    });
    var listItemLabel = $("<label>");
    listItemLabel.text(newItem);

    $(formCreate).append(listItem);
    $(formCreate).append(listItemLabel);
    $(formCreate).append($("<br>"));
  });

  $(preferencesDivEl).append(formCreate);
  var nextBtn = $("<input>");
  nextBtn.attr({
    type: "submit",
    id: "questionnaire-submit",
  });
  $(formCreate).append(nextBtn);

  // TODO: Create response to log preferences to local storage and also take to next question
  questionnaireSubmitBtn = $("#questionnaire-submit");
  questionnaireSubmitBtn.on("click", function (event) {
    event.preventDefault();
    var checkedInputs = $("input:checked");

    storePreferences(currentKey, checkedInputs);
    questionIndex++;
    if (questionIndex === questions.length) {
      // TODO: go to next function to display results
      $(preferencesDivEl).empty();
      content.dataset.state = "visible";
      displayResults();
      console.log(displayResults);
    } else {
      render();
    }
  });
}

// Function to display final results of questionnaire query
function displayResults() {
  var yelpApiCurate =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?category=restaurants" +
    "&" +
    latitude +
    "&" +
    longitude +
    "&" +
    ethnicPreferences +
    "&" +
    "&limit=3" +
    "&" +
    budgetPreference +
    "&open_now";
  console.log(yelpApiCurate);
}

//Get the preferences from local storage and store them in the global variables
function getPreferences() {
  dietaryAllergies = JSON.parse(localStorage.getItem("allergies"));
  dietaryRestrictions = JSON.parse(localStorage.getItem("preferences"));
  ethnicPreferences = JSON.parse(localStorage.getItem("ethnicities"));
  budgetPreference = JSON.parse(localStorage.getItem("cost"));
}

//Store the user preferences (allergies, location, cost) in localStorage
function storePreferences(key, values) {
  var optionsArray = [];
  $.each(values, function () {
    optionsArray.push($(this).val());
  });
  localStorage.setItem(key, JSON.stringify(optionsArray));
}

//Populates the empty div container with the result from the API call
function presentRestaurants() {
  console.log("presentRestaurants is running");
  for (var i = 0; i < randRestaurants.length; i++) {
    var restCard = $("<div>").addClass("rest-card");
    restCard.append($("<h1>").text(randRestaurants[i].name));
    restCard.append($("<p>").text(randRestaurants[i].rating));
    restCard.append($("<img>").attr("src", randRestaurants[i].image_url));
    restContainer.append(restCard);
  }
  // NOTE: this line is just for testing purposes
  pageRedirect(randRestaurants[0].id);
}

//Clear the div container
function clearContainer() {
  restContainer.classList.add("hide");
  nextEl.classList.remove("hide");
  restaurantNewPage();
}

//If they click on the restaurant, save the restaurant data in the URL and go to new page where more information is shown and mapping can be done
function restaurantNewPage() {
  var queryString =
    "./search-results.html?q=" + searchInputVal + "&format=" + formatInputVal;

  location.assign(queryString);
}

//randRestaurants.addEventListener('click', handleSearchFormSubmit);

// Function that redirects page to lastindex.html whenever a restaurant has been chosen
// TODO: link this function to the eventListeners whenever the user chooses a restaurant as their destination
function pageRedirect(restaurantID) {
  var queryString = "./lastindex.html?id=" + restaurantID;
  console.log(queryString);
  location.assign(queryString);
}

//Event listeners
userAddressInputBtn.on("click", getUserLocation);
randomBtn.on("click", pickRandRestaurants);
// Takes user to questionIndex
userPreferencesBtn.on("click", function () {
  content.dataset.state = "hidden";
  $(preferencesDivEl).data("state", "visible");
  questionIndex = 0;
  render();
});

getLocalZipCode();
getPreferences();
