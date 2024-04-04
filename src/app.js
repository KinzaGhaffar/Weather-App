// Importing required modules
const express = require("express"); // for building web applications
const hbs = require("hbs"); // for templating, a template engine
const path = require("path"); // for handling file paths

// Initializing Express.js app
const app = express();

const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath); // Tell Express where to find HTML files for web pages
hbs.registerPartials(partialsPath); // partials are the reusable components that can be used in multiple HTML or hbs files
app.use(express.static(publicPath)); // Share CSS and JavaScript files for the web pages

// Importing weatherData function from the utils folder
const weatherData = require("../utils/weatherData");
const { error } = require("console");

// Setting up the port number for the server
const port = process.env.PORT || 3000; // Setting the port number for the server, defaulting to 3000 if not specified in the environment

// Defining route for the root URL ("/")
app.get("/", (req, res) => {
  res.render("index", { title: "weather app" });
});

// Defining route for "/weather"
app.get("/weather", (req, res) => {
  // Checking if address query parameter is provided
  if (!req.query.address) {
    return res.send("Address is required!");
  }
  // Calling weatherData function with the provided address
  weatherData(req.query.address, (error, result) => {
    if (error) {
      return res.send(error);
    }
    res.send(result);
  });
});

app.get("*", (req, res) => {
  res.send("This route does not exisit!!!");
});

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log("Server is listening on port ", +port);
});
