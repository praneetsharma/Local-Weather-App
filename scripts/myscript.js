$(document).ready(function() {

  var BASE_URL = "http://api.openweathermap.org/data/2.5/weather";
  var APP_KEY = "b551c8f5d7dbf3bae27399d06c364303";
  var SPACE = " ";

  // Mapping of open-weather's names to my own weather names
  // The rest of the maps will be using my weather names to get me things.
  // This way I can separate out rest of my logic from how a particular
  // website calls the weather names.
  var openWeather_myWeather_map = {
    "Thunderstorm": "thunderstorm",
    "Drizzle": "drizzle",
    "Rain": "rain",
    "Snow": "snow",
    "Atmosphere": "haze",
    "Clear": "sunny",
    "Clouds": "clouds"
  };

  // hash map of what background color to choose
  // given the weather type
  var weather_backColor_map = {
    "thunderstorm": "#F4F6F6",
    "drizzle": "#AED6F1",
    "rain": "#5DADE2",
    "snow": "#F4F6F7",
    "haze": "#95A5A6",
    "sunny": "#F4D03F",
    "clouds": "#E5E7E9"
  };

  var TEMPERATURE_UNIT_MAP = {
    "celcius": "C",
    "farenheit": "F"
  };
  var TEMPERATURE_UNIT = TEMPERATURE_UNIT_MAP.celcius;

  function getBackgroundColor(type) {
    return weather_backColor_map[openWeather_myWeather_map[type]];
  }

  function toggleTemperatureUnit () {
    if (TEMPERATURE_UNIT === TEMPERATURE_UNIT_MAP.celcius) {
      TEMPERATURE_UNIT = TEMPERATURE_UNIT_MAP.farenheit;
    } else {
      TEMPERATURE_UNIT = TEMPERATURE_UNIT_MAP.celcius;
    }
  }

  // converts kelvin to celcius and rounds off to 2 decimal places
  function kelvinToCelcius (kel) {
    return (kel - 273.15).toFixed(2);
  }

  // converts celcius to farenheit and rounds off to 2 decimal places
  function celciusToFarenheit (cel) {
    return ((9.0 / 5.0) * cel + 32.0).toFixed(2);
  }

  // converts farenheit to celcius and rounds off to 2 decimal places
  function farenheitToCelcius (fn) {
    return ((5.0 / 9.0) * (fn - 32.0)).toFixed(2);
  }

  function getLocation () {
    navigator.geolocation.getCurrentPosition(successGetLocation, errorGetLocation);
  }
  function successGetLocation (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    latitude = latitude.toFixed(1); // rounding off to single decimal
    longitude = longitude.toFixed(1); // rounding off to single decimal

    var url = BASE_URL + "?lat=" + latitude + "&lon=" + longitude + "&APPID=" + APP_KEY;

    getWeatherInfo(url);
  }
  function errorGetLocation (positionError) {
    console.warn(positionError.code + ":" + positionError.message);
  }

  function getWeatherInfo (url_) {
    $.ajax({
      url: url_,
      success: function (result) {

        $("body").css("background-color", getBackgroundColor(result.weather[0].main));

        $(".weather-type").html(result.weather[0].main);
        $(".temperature-value").html(kelvinToCelcius(result.main.temp));
        $(".temperature-unit").html(TEMPERATURE_UNIT);
      },
      error: function (err) {
        alert(err.code + ":" + err.message);
      }
    });
  }

  getLocation();

});
