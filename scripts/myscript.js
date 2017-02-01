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

  // Mapping of weather type to weather icon
  var myWeather_icon_map = {
    "thunderstorm": "wi-thunderstorm",
    "drizzle": "wi-sprinkle",
    "rain": "wi-rain",
    "snow": "wi-snow",
    "haze": "wi-day-haze",
    "sunny": "wi-day-sunny",
    "clouds": "wi-cloudy"
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

  // Temperature units supported
  var TEMPERATURE_UNIT_MAP = {
    "celcius": "C",
    "farenheit": "F"
  };
  var TEMPERATURE_UNIT = TEMPERATURE_UNIT_MAP.celcius; // default temperature unit

  // Given the openWeather type, return the background color to be set for body
  function getBackgroundColor(type) {
    return weather_backColor_map[openWeather_myWeather_map[type]];
  }

  // Toggle the temperature unit and its value
  function toggleTemperatureUnit () {
    var tempUnit = $(".temperature-unit").text();
    var tempVal = $(".temperature-value").text();

    // based on the current temperature unit, converting from one temperature
    // unit to another
    if (tempUnit === TEMPERATURE_UNIT_MAP.celcius) {
      tempUnit = TEMPERATURE_UNIT_MAP.farenheit;
      tempVal = celciusToFarenheit(tempVal);
    } else {
      tempUnit = TEMPERATURE_UNIT_MAP.celcius;
      tempVal = farenheitToCelcius(tempVal);
    }

    $(".temperature-unit").html(tempUnit);
    $(".temperature-value").html(tempVal);
  }

  function buildIconElement (weatherType) {
    var iconElem = "<i class='wi " + myWeather_icon_map[weatherType] + "'></i>";
    return iconElem;
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

  // Function that gets the current position. On success, requestWeatherInfo
  // callback function is called
  function getLocation () {
    navigator.geolocation.getCurrentPosition(requestWeatherInfo, errorGetLocation);
  }

  // Function to request the weather info
  function requestWeatherInfo (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    latitude = latitude.toFixed(1); // rounding off to single decimal
    longitude = longitude.toFixed(1); // rounding off to single decimal

    // Build request url (openweathermap API being used)
    var url = BASE_URL + "?lat=" + latitude + "&lon=" + longitude + "&APPID=" + APP_KEY;

    getWeatherInfo(url);
  }

  // Makes ajax request using input URL to get different kinds of weather info
  // Based on the response received, it sets temperature value, temperature unit,
  // weather icon, and background color as well.
  function getWeatherInfo (url_) {
    $.ajax({
      url: url_,
      success: function (result) {

        var weatherType = result.weather[0].main;

        // Set background color based on the weather type received
        $("body").css("background-color", getBackgroundColor(weatherType));

        $(".weather-type").html(weatherType);
        $(".temperature-value").html(kelvinToCelcius(result.main.temp));
        $(".temperature-unit").html(TEMPERATURE_UNIT);

        $(".weather-icon").html(buildIconElement(openWeather_myWeather_map[weatherType]));
      },
      error: function (err) {
        alert(err.code + ":" + err.message);
      }
    });
  }

  function errorGetLocation (positionError) {
    console.warn(positionError.code + ":" + positionError.message);
  }




  // ALL MAGIC HAPPENS FROM HERE
  getLocation();

  // temperature value and type toggle on click
  $(".temperature-unit")
    .click(toggleTemperatureUnit)
    .hover(function() {
      $(this).css('cursor','pointer');
    });

});
