// Define the weather API endpoint
var weatherApi = "/weather";

// Select necessary DOM elements
const weatherForm = document.querySelector("form");

const search = document.querySelector("input");

const weatherIcon = document.querySelector(".weatherIcon i");

const weatherCondition = document.querySelector(".weatherCondition");

const tempElement = document.querySelector(".temperature span");

const locationElement = document.querySelector(".place");

// Display the current date
const dateElement = document.querySelector(".date");
const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = new Date().getDate() + ", " + monthName;

// Event listener for form submission
weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log(search.value);
  locationElement.textContent = "Loading...";
  weatherIcon.className = "";
  tempElement.textContent = "";
  weatherCondition.textContent = "";

  // Fetch weather data for the entered location
  showData(search.value);
});

// Check if geolocation is supported
if ("geolocation" in navigator) {
  // Show loading message while fetching geolocation
  locationElement.textContent = "Loading...";

  // Fetch current geolocation coordinates
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Construct reverse geocoding API URL
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      // Fetch city name based on coordinates
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.address && data.address.city) {
            // Display weather data for detected city
            const city = data.address.city;

            showData(city);
          } else {
            console.error("City not found in location data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    },
    function (error) {
      console.error("Error getting location:", error.message);
    }
  );
} else {
  console.error("Geolocation is not available in this browser.");
}

// Function to fetch and display weather data for a given city
function showData(city) {
  // Fetch weather data from the server
  getWeatherData(city, (result) => {
    console.log(result);

    // Display weather information on the webpage
    if (result.cod == 200) {
      if (
        result.weather[0].description == "rain" ||
        result.weather[0].description == "fog"
      ) {
        weatherIcon.className = "wi wi-day-" + result.description;
      } else {
        weatherIcon.className = "wi wi-day-cloudy";
      }
      locationElement.textContent = result?.name;
      tempElement.textContent =
        (result?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176);
      weatherCondition.textContent =
        result?.weather[0]?.description?.toUpperCase();
    } else {
      locationElement.textContent = "City not found.";
    }
  });
}

// Function to fetch weather data from the server
function getWeatherData(city, callback) {
  const locationApi = weatherApi + "?address=" + city;

  // Make AJAX request to fetch weather data
  fetch(locationApi).then((response) => {
    response.json().then((response) => {
      // Pass the retrieved data to the callback function
      callback(response);
    });
  });
}
