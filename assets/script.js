if (!localStorage["searchHistory"]) {
  localStorage["searchHistory"] = JSON.stringify([]);
}

var apiKey = "2a980a820d1b255b9609b3f0f671cc24";

var today = moment();
$("#main-date").text(today.format("dddd, MMMM Do, YYYY"));

function setTime() {
  var time = moment();
  $("#main-time").text(time.format("h:mm:ss a"));
}
setInterval(setTime, 1000);

function displayWeatherCondition(response) {
  document.querySelector("#main-city").innerHTML = response.data.name;
  document.querySelector("#main-temp").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#main-humidity").innerHTML =
    response.data.main.humidity;
  document.querySelector("#main-wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  var iconElement = document.querySelector("#main-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city, storeSearch) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeatherCondition);
  if (storeSearch) {
    storeHistory(city);
  }
  showSearchHistory();
}

function handleSumit(event) {
  event.preventDefault();
  var city = document.querySelector("#input-city").value;
  if (city.length != 0) {
    searchCity(city, true);
  }
}
function handleSumitBtn(event) {
  event.preventDefault();
  var city = event.target.innerHTML;
  searchCity(city, false);
}

function displayBoth(response) {
  displayForecast(response);
  displayUv(response);
}

function displayUv(response) {
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
    return "uv-orange";
  }
}

///Forecast

function getForecast(coordinates) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayBoth);
}

function displayForecast(response) {
  var forecast = response.data.daily;

  var forecastElement = document.querySelector("#forecastA");

  var forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    var day = moment(forecastDay.dt * 1000);

    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col forecast">   
        <h4 class="forecast-week">${day.format("ddd")}</h4>
         <p class="forecast-date">${day.format("MMM-DD-YY")}</p>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
          class="forecast-icon" 
        />
        <div class="forecast-details">
          <span class="forecast-mintemp"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
          <span> | </span>
          <span class="forecast-maxtemp"> ${Math.round(
            forecastDay.temp.max
          )}° </span> 
          <div>Wind: <span class="forecast-wind">${Math.round(
            forecastDay.wind_speed
          )} </span> MPH</div>
          <div> Humidity: <span class="forecast-hum">${Math.round(
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

/// History storage

function storeHistory(city) {
  var storageKey = "searchHistory";
  console.log(localStorage[storageKey]);
  var historyArray = JSON.parse(localStorage[storageKey]);
  historyArray.push(city);
  localStorage[storageKey] = JSON.stringify(historyArray);
}

function showSearchHistory() {
  var storageKey = "searchHistory";
  var historyArray = JSON.parse(localStorage[storageKey]);

  var cityElement = document.querySelector(".cities-list");
  var cityListHTML = `<ul>`;

  for (var i = 0; i < Math.min(historyArray.length, 8); i++) {
    cityListHTML += `<li class="city-history-btn">${historyArray[i]}</li>`;
  }

  cityListHTML = cityListHTML + `</ul>`;
  cityElement.innerHTML = cityListHTML;

  var searchCityBtn = document.querySelectorAll(".city-history-btn");
  for (var i = 0; i < searchCityBtn.length; i++) {
    searchCityBtn[i].addEventListener("click", handleSumitBtn);
  }
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

//loadHistory();
searchCity("New York", false);
