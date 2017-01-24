$(document).ready(function() {

  var BASE_URL = "http://api.openweathermap.org/data/2.5/weather";
  var APP_KEY = "b551c8f5d7dbf3bae27399d06c364303";

  var TEMPERATURE_UNIT = {
    "celcius": "C",
    "farenheit": "F"
  };
  var DEFAULT_TEMPERATURE_UNIT = TEMPERATURE_UNIT.celcius;

  var LATITUDE = 0.0;
  var LONGITUDE = 0.0;

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
    LATITUDE = position.coords.latitude;
    LATITUDE = LATITUDE.toFixed(1); // rounding off to single decimal

    LONGITUDE = position.coords.longitude;
    LONGITUDE = LONGITUDE.toFixed(1); // rounding off to single decimal

    var url = BASE_URL + "?lat=" + LATITUDE + "&lon=" + LONGITUDE + "&APPID=" + APP_KEY;

    getWeatherInfo(url);
  }
  function errorGetLocation (positionError) {
    console.warn(positionError.code + ":" + positionError.message);
  }

  function getWeatherInfo (url_) {
    $.ajax({
      url: url_,
      success: function (result) {
        $(".weather-type").html(result.weather[0].main);
        $(".weather-temp").html(kelvinToCelcius(result.main.temp) + DEFAULT_TEMPERATURE_UNIT);
      },
      error: function (err) {
        alert(err.code + ":" + err.message);
      }
    });
  }

  getLocation();

});
