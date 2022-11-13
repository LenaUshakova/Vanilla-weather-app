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
  return { hrs, mins };
}


// Forecast for a week
function forecastDayCalc(dt) {
  let date = new Date(dt * 1000);
  let day = date.getDay();
  let days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily)
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast-week");
  let forecastHTML = "";
  forecast.forEach(function(day, index){
    if (index <5){
  forecastHTML = forecastHTML + ` 
    <div class="col-md-2">
  <div class="forecast-day">${forecastDayCalc(day.dt)}</div>
  <div class="forecast-icon">
    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" width="60" alt=${day.weather[0].main}/>
  </div>
  <div class="forecast-temperature">
    <div class="min-temperature inline">${Math.round(day.temp.min)}</div>
    <div class="celsius inline">° /</div>
    <div class="max-temperature inline">${Math.round(day.temp.max)}</div>
    <div class="celsius inline">°</div>
  </div>
</div>`;}
})
forecastElement.innerHTML = forecastHTML;
}

function getForecast (coordinates) {
  let apiKey="535cacbb3f8a0df0aeb4790235b9541f";
  let apiURL=`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
axios.get(apiURL).then(displayForecast)};

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
  unitFlag = "C";
  tempUnit.innerHTML = "C";
  let rain = response.data.rain;
  let curTemp = Math.round(response.data.main.temp);
  cityLabel.innerHTML = response.data.name;
  tempValue.innerHTML = curTemp;
  console.log("response", response.data);
  document.querySelector("#precipitation").innerHTML = rain ? rain['1h'] : 0;
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
  // weather icon from API
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    // week forecast
    getForecast (response.data.coord);
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

getWeatherByName("Kyiv");

// Celsius to Fahrenheit flag
let unitFlag = "C";
let toFahrenheit = document.querySelector(".cels");
let toCelsius = document.querySelector(".fahr");
let tempValue = document.querySelector(".temperature.inline .value");
let tempMinValue = document.querySelector(".min-temperature");
let tempMaxValue = document.querySelector(".max-temperature");
let tempUnit = document.querySelector(".temperature.inline .unit");
let currentLocation = document.querySelector(".fa-location-crosshairs");
let forecastMinTempElemnts = document.getElementsByClassName("min-temperature inline");
let forecastMaxTempElemnts = document.getElementsByClassName("max-temperature inline");

function unitConverter() {
  let buf = tempValue.innerHTML;

  if (unitFlag === "C") {
    tempValue.innerHTML = Math.round(buf * 1.8 + 32);
    // Min Forecast
    for (const el of forecastMinTempElemnts) {
      const buf = el.innerHTML;
      el.innerHTML = Math.round(buf * 1.8 + 32);
    }
    // Max Forecast
    for (const el of forecastMaxTempElemnts) {
      const buf = el.innerHTML;
      el.innerHTML = Math.round(buf * 1.8 + 32);
    }

    tempUnit.innerHTML = "F";
    unitFlag = "F";
  } else {
    tempValue.innerHTML = Math.round((buf - 32) / 1.8);
    for (const el of forecastMinTempElemnts) {
      const buf = el.innerHTML;
      el.innerHTML = Math.round((buf - 32) / 1.8);
    }
    for (const el of forecastMaxTempElemnts) {
      const buf = el.innerHTML;
      el.innerHTML = Math.round((buf - 32) / 1.8);
    }

    tempUnit.innerHTML = "C";
    unitFlag = "C";
  }
}

tempUnit.addEventListener("click", unitConverter);
currentLocation.addEventListener("click", currentLocationHandler);
