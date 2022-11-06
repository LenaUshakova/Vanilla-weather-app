// Format Day
function dayCalc(dt) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date(dt).getDay()];
}

//  Format Time
function timeZoneCalc(dt) {
  let datetime = new Date(dt);
  let hrs = datetime.getHours();
  let mins = datetime.getMinutes();

  if (hrs < 10) {
    hrs = `0${hrs}`;
  }

  if (mins < 10) {
    mins = `0${mins}`;
  }
  console.log("HRS MINS", hrs, mins);
  return { hrs, mins };
}

// City Search + Current Temperature
function getWeatherByCoords(coords) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=${units}`;
  return axios.get(apiUrl).then(uiUpdate);
}

function getWeatherByName(cityName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  return axios.get(apiUrl).then(uiUpdate);
}

function uiUpdate(response) {
  let curTemp = Math.round(response.data.main.temp);
  cityLabel.innerHTML = response.data.name;
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
  // time getting from OpenWeather API
  let time = timeZoneCalc(response.data.dt * 1000);
  document.querySelector(
    "#current-time"
  ).innerHTML = `${time.hrs}:${time.mins}`;
  // day getting from OpenWeather API
  document.querySelector("#weekday").innerHTML = dayCalc(
    response.data.dt * 1000
  );
}

function searchFieldHandler(e) {
  let cityName = searchField.value.trim();
  if (e.key === "Enter" && cityName !== "") {
    getWeatherByName(cityName);
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
    getWeatherByCoords(coords);
  });
}

let cityLabel = document.querySelector(".city");
let searchField = document.querySelector(".search-field");
let apiKey = "50ee506356ef421435ae534c3e4094fb";
let units = "metric";

searchField.addEventListener("keypress", searchFieldHandler);

currentLocationHandler();

// Celsius to Fahrenheit

let ct = 0;
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
