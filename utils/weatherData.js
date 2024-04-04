// Importing the request module for making HTTP requests
const request = require("request");

// Defining an object containing base URL and API key for the OpenWeatherMap API
const openWeatherApp = {
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
  SECRET_KEY: "9e3fbd23c50df2bf3aeac93e37cafb7f",
};

// Defining a function to fetch weather data for a given address
const weatherData = (address, callback) => {
  // Constructing the request URL using the base URL, encoded address, and API key
  const url =
    openWeatherApp.BASE_URL +
    encodeURIComponent(address) + // Encoding the address to handle special characters
    "&APPID=" +
    openWeatherApp.SECRET_KEY;

  console.log(url);

  // Making an HTTP request to the OpenWeatherMap API using the constructed URL
  request({ url, json: true }, (error, data) => {
    if (error) {
      callback(true, "Unable to fetch data!!!" + error);
    }
    callback(false, data?.body);
  });
};

module.exports = weatherData;
