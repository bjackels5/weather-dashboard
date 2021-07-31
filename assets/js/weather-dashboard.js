const myApiKey = "45b6628acc471a2f58817952c3e45e67";
const apiSite = "http://api.openweathermap.org/"


// UV scale: https://www.epa.gov/sunsafety/uv-index-scale-0

var convertCityToLatLong = function(cityName)
{
    var apiUrl = apiSite + "geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + myApiKey;

    // make a request to the url
    fetch(apiUrl).then(function(response)
    {
        if (response.ok)
        {
            response.json().then(function(data)
            {
                console.log(data);
            });
        }
        else
        {
            alert("Error: City Not Found");
        }
    })
    .catch(function(error)
    {
        alert("Unable to connect to OpenWeather");
    });
}

var rwfc = function(cityName) // use saved data while working on this so I have fewer hits to the API
{
    weatherInfo = JSON.parse(localStorage.getItem("weather"));
    renderWeatherForCity(weatherInfo, cityName);
}

var getWeatherIconUrl = function(wIcon)
{
    return "http://openweathermap.org/img/wn/" + wIcon + ".png";
}

var renderWeatherForCity = function(weatherInfo, cityName)
{
    var currentWeather = weatherInfo.current;
    var now = luxon.DateTime.now();
    var cityDatePEl = document.querySelector("#city-date p")
    cityDatePEl.textContent =    cityName + " (" + now.toLocaleString() + ")";
    // use currentWeather.weather.icon to see the weather icon at the end of the above string
    var wIconUrl = getWeatherIconUrl(currentWeather.weather[0].icon);
    var iconEl = document.querySelector("#weather-icon");
    iconEl.src = wIconUrl;
}

var getWeatherForCity = function(cityName)
{
    var apiUrl = apiSite + "geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + myApiKey;

    // make a request to the url
    fetch(apiUrl).then(function(response)
    {
        if (response.ok)
        {
            return response.json();
         }
        else
        {
            Promise.reject(response); // alert("Error: City Not Found");
        }
    })
    .then(function (data)
    {
        var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="
                + data[0].lat
                + "&lon="
                + data[0].lon
                + "&exclude=minutely,hourly,alerts&units=imperial&appid="
                + myApiKey;
        return fetch(oneCallUrl);
    })
    .then(function (response) {
        if (response.ok)
        {
            return response.json();
        }
        else
        {
            Promise.reject(response); // alert("Error: Can't Get Weather Data");
        }
    })
    .then(function(data) {
//        console.log(data);
        renderWeatherForCity(data, cityName);
    })
    .catch(function(error)
    {
        console.warn(error);
    });
}

/* BACKUP
var getWeatherForCity = function(cityName)
{
    var apiUrl = apiSite + "geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + myApiKey;

    // make a request to the url
    fetch(apiUrl).then(function(response)
    {
        if (response.ok)
        {
            response.json().then(function(data)
            {
                apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="
                    + data[0].lat
                    + "&lon="
                    + data[0].lon
                    + "&exclude=minutely,hourly,alerts&appid="
                    + myApiKey;

                console.log(apiUrl);
            });
        }
        else
        {
            alert("Error: City Not Found");
        }
    })
    .catch(function(error)
    {
        alert("Unable to connect to OpenWeather");
    });
}
*/





