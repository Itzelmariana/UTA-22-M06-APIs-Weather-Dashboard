let apiKey = "2a980a820d1b255b9609b3f0f671cc24";
var today = moment();
$("#main-date").text(today.format("dddd, MMMM Do, YYYY"));

function setTime() {
  var time = moment();
  $("#main-time").text(time.format("h:mm:ss a"));
}
setInterval(setTime, 1000);

function displayWeatherCondition(response) {
  console.log(response);
  document.querySelector("#main-city").innerHTML = response.data.name;
  document.querySelector("#main-temp").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#main-humidity").innerHTML =
    response.data.main.humidity;
  document.querySelector("#main-wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  let iconElement = document.querySelector("#main-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSumit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city").value;
  searchCity(city);
}

function displayBoth(response) {
  displayForecast(response);
  displayUv(response);
}

function displayUv(response) {
  console.log(response);
  var currentUvi = document.querySelector("#main-uv");
  currentUvi.innerHTML = response.data.current.uvi;
  currentUvi.className = color(response.data.current.uvi);
}

function color(uvi) {
  if (uvi < 2) {
    return "uv-green";
  } else if (uvi > 6) {
    return "uv-red";
  } else {
    return "uv-orage";
  }
}

///Forecast

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayBoth);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecastA");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col forecast">
  
        <h4 id="forecast-date">${formatDay(forecastDay.dt)}</h4>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
          class="forecast-icon" 
        />
        <div class="forecast-details">
          <span class="maxtemp"> ${Math.round(forecastDay.temp.min)}° </span>
          <span> | </span>
          <span class="mintemp"> ${Math.round(forecastDay.temp.max)}° </span> 
          <div>Wind: <span id="forecast-wind">${Math.round(
            forecastDay.wind_speed)} </span> MPH</div>
          <div> Humidity: <span id="forecast-hum">${Math.round(
            forecastDay.humidity
          )}</span>%</div>
        </div>
        
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

///Buttons Event listener

var searchBar = document.querySelector("#search-btn");
searchBar.addEventListener("click", handleSumit);

var inputCity = document.querySelector("#input-city");
const enterKey = 13;
inputCity.addEventListener("keyup", function (event) {
  if (event.keyCode === enterKey) {
    event.preventDefault();
    document.getElementById("search-btn").click();
  }
});

///Up to date info
searchCity("New York");
