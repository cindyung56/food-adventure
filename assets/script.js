
//shows empty div container with results from API call
//Define user preference variables
var userPreferencesBtn = $("#prefBtn");
var testUrl =
  "https://thezipcodes.com/api/v1/search?zipCode=13040&countryCode=US&apiKey=bb5257b61f84cbecea9a7c62f342c081";
var userAddressInput = $("#address-input");
var userAddressInputBtn = $("#address-btn");
var randomBtn = $("#randomizeBtn");
var yelpApiKey =
  "tilQS7iQb9uT4oDutOHFo7mguhA3WFGZJO8uiT3DWXhR59mn0QAaXi4kCwjEUwt2EeSftvh_vLt_YA5QiOxU7xPlxy_mYk9ZdpXzKSUrpL3iv3OAvt5AJxX4KHcOY3Yx";
var latitude;
var longitude;
var randRestaurants;
var questionIndex = 0;
var formCreate = $("<form>");

var dietaryAllergies;
var dietaryRestrictions;
var ethnicPreferences;
var budgetPreference;


//Prompt the user to get their location data or have them enter address/zip code
function getUserLocation(event) {
  event.preventDefault();
  var zipCodeApiUrl = "https://thezipcodes.com/api/v1/search?zipCode=";
  if (isNaN(userAddressInput.val()) || userAddressInput.val().length > 5) {
    /*TODO add display to say they must enter a number*/
    console.log("NOT A NUMBER");
    return 0;
  }
  console.log(userAddressInput.val());

  zipCodeApiUrl =
    zipCodeApiUrl +
    userAddressInput.val() +
    "&countryCode=US&apiKey=bb5257b61f84cbecea9a7c62f342c081";

  fetch(zipCodeApiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success ZIP:", data);
      latitude = data.location[0].latitude;
      longitude = data.location[0].longitude;
      console.log(latitude + "\n" + longitude);
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
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=delis&latitude=";
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
          randRestaurants.push(data.businesses[i]);
        }
        if (randRestaurants < 3) {
          notEnoughOpen();
          return 0;
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// User Preferences Questionaire
var questions = [
  {
    question: "Do you have any allergies?",
    choices: [
      "Milk",
      "Tree nuts",
      "Eggs",
      "Peanuts",
      "Fish",
      "Wheat",
      "Shellfish",
      "Soybeans",
      "None",
    ],
    keyValue: "allergies"
  },

  {
    question: "Do you have any dietary preferences/restrictions?",
    choices: ["Vegetarian", "Vegan", "Keto", "Kosher", "Gluten-Free", "None"],
    keyValue: "preferences"
  },

  {
    question: "Which food ethnicities do you prefer?",
    choices: ["American", "Asian", "Italian", "Mexican", "None"],
    keyValue: "ethnicities"
  },

  {
    question: "How much are you willing to spend?",
    choices: ["$0-30", "$30-50", "$50-100", "$100+"],
    keyValue: "cost"
  }
];



// Display questionnaire questions and preferences
function render() {
  // clears question data/elements
  $(content).empty();
  $(formCreate).empty();

  var userQuestion = questions[questionIndex].question;
  var userChoices = questions[questionIndex].choices;
  var currentKey = questions[questionIndex].keyValue;
  content.textContent = userQuestion;


  // forEach function creates a list element for each preference option
  userChoices.forEach(function (newItem) {
    // console.log(newItem);
    var listItem = $("<input>");
    // console.log(listItem);
    listItem.attr({
      "type": "checkbox",
      "value": newItem
    })
    var listItemLabel = $("<label>");
    listItemLabel.text(newItem);
    
    $(formCreate).append(listItem);
    $(formCreate).append(listItemLabel);
    $(formCreate).append($("<br>"));

  });

  $(content).append(formCreate);
  var nextBtn = $("<input>");
  nextBtn.attr({"type": "submit", "id": "questionairre-submit", "class": "bg-primary text-white"});
  $(formCreate).append(nextBtn);

  // TODO: Create response to log preferences to local storage and also take to next question
  questionairreSubmitBtn = $('#questionairre-submit');
  questionairreSubmitBtn.on('click', function(event){
    event.preventDefault();
    var checkedInputs = $('input:checked');
    // console.log(checkedInputs);
    
    storePreferences(currentKey, checkedInputs);
    questionIndex++;
    if (questionIndex === questionIndex.length - 1){
      // TODO: go to next function to display results
    } else{
      render();
    }
    
  });

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
  // console.log(optionsArray);
  localStorage.setItem(key, JSON.stringify(optionsArray));
}

//Populates the empty div container with the result from the API call
function presentRestaurants() {}

//.........................
//Clear the div container
function clearContainer() {
    resultEl.classList.add("hide")
    nextEl.classList.remove("hide");
    restaurantNewPage()
}
//.......................................

//If they click on the restaurant, save the restaurant data in the URL and go to new page where more information is shown and mapping can be done
function restaurantNewPage() {}

//Event listeners
userAddressInputBtn.on("click", getUserLocation);
randomBtn.on("click", pickRandRestaurants);
// Takes user to questionIndex
userPreferencesBtn.on("click", function () {
  render();
});

getPreferences();