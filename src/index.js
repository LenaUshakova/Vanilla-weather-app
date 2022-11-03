// Current Day
let currentDay = document.querySelector("#weekday");
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[new Date().getDay()];

currentDay.innerHTML = day;

// Current Time
let currentTime = document.querySelector("#current-time");
let hours = new Date().getHours();
let minutes = new Date().getMinutes();

if (hours < 10) {
  hours = `0${hours}`;
}

if (minutes < 10) {
  minutes = `0${minutes}`;
}

currentTime.innerHTML = `${hours}:${minutes}`;

// City Search + Current Temperature
function getCityName(coords) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=${units}`;
  return axios.get(apiUrl).then(function (response) {
    let cityName = response.data.name;
    let curTemp = Math.round(response.data.main.temp);
    cityLabel.innerHTML = cityName;
    tempValue.innerHTML = curTemp;
    console.log("response", response.data);
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML =
      Math.round(response.data.wind.speed * 3.6 * 1) / 1;
    document.querySelector("#weather-description").innerHTML =
      response.data.weather[0].main;
    document.querySelector(".max-temperature").innerHTML = Math.round(
      response.data.main.temp_max
    );
    document.querySelector(".min-temperature").innerHTML = Math.round(
      response.data.main.temp_min
    );
  });
}

function getCityWeather(cityName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  return axios.get(apiUrl).then(function (response) {
    let curTemp = Math.round(response.data.main.temp);
    console.log("response", response.data);
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML =
      Math.round(response.data.wind.speed * 3.6 * 1) / 1;
    document.querySelector("#weather-description").innerHTML =
      response.data.weather[0].main;
    document.querySelector(".max-temperature").innerHTML = Math.round(
      response.data.main.temp_max
    );
    document.querySelector(".min-temperature").innerHTML = Math.round(
      response.data.main.temp_min
    );
    cityLabel.innerHTML = response.data.name;
    tempValue.innerHTML = curTemp;
  });
}

function searchFieldHandler(e) {
  let cityName = searchField.value.trim();
  if (e.key === "Enter" && cityName !== "") {
    getCityWeather(cityName);
    searchField.value = "";
  }
}

function currentLocationHandler() {
  navigator.geolocation.getCurrentPosition(function (currentPosition) {
    let coords = {
      lat: currentPosition.coords.latitude,
      lon: currentPosition.coords.longitude,
    };
    console.log("COORDS", coords);
    getCityName(coords);
  });
}

let cityLabel = document.querySelector(".city");
let searchField = document.querySelector(".search-field");
let apiKey = "50ee506356ef421435ae534c3e4094fb";
let units = "metric";

searchField.addEventListener("keypress", searchFieldHandler);

getCityWeather("Kyiv");

// Celsius to Fahrenheit

let ct = 20;
let ft = Math.round(ct * 1.8 + 32);
let unitFlag = "C";

let toFahrenheit = document.querySelector(".cels");
let toCelsius = document.querySelector(".fahr");
let tempValue = document.querySelector(".temperature.inline .value");
let tempUnit = document.querySelector(".temperature.inline .unit");
let currentLocation = document.querySelector(".fa-location-crosshairs");

tempValue.innerHTML = ct;

function unitConverter() {
  if (unitFlag === "C") {
    tempValue.innerHTML = ft;
    tempUnit.innerHTML = "F";
    unitFlag = "F";
  } else {
    tempValue.innerHTML = ct;
    tempUnit.innerHTML = "C";
    unitFlag = "C";
  }
}

tempUnit.addEventListener("click", unitConverter);
currentLocation.addEventListener("click", currentLocationHandler);
