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

var getUviColorClass = function(uvi)
{
    var colorIndex = Math.min(Math.floor(uvi), 11);
    return "uv-" + colorIndex;
}

var renderWeatherForForecast = function(day, weather, now, forecastEl)
{
    forecastEl.style.display = "block";

    for (var i = 0; i < forecastEl.children.length; i++)
    {   
        var className = forecastEl.children[i].className;
        var fieldIndex = className.indexOf("fiveday-");
        if (fieldIndex >= 0)
        {
            fieldIndex += "fiveday-".length;
            var fieldType = className.slice(fieldIndex, fieldIndex+4);

            switch(fieldType)
            {
                case "date": // fiveday-date
                    var theDate = now.plus({days: day});
                    forecastEl.children[i].textContent = theDate.toLocaleString();
                break;
                case "weat": // fiveday-weather-icon
                    var wIconUrl = getWeatherIconUrl(weather.weather[0].icon);
                    forecastEl.children[i].src = wIconUrl;
                break;
                case "temp": // fiveday-temp
                    forecastEl.children[i].getElementsByTagName("span")[0].textContent = weather.temp.day;
                break;
                case "wind": // fiveday-wind
                    forecastEl.children[i].getElementsByTagName("span")[0].textContent = weather.wind_speed;
                break;
                case "humi": // fiveday-humid
                    forecastEl.children[i].getElementsByTagName("span")[0].textContent = weather.humidity;
                break;
                default:
                    alert("class is: " + className);
            }
        }
    }    
}

var renderWeatherForCity = function(weatherInfo, cityName)
{
    var now = luxon.DateTime.now();

    // show the current weather in the top box
    var currentWeather = weatherInfo.current;
    var cityDatePEl = document.querySelector("#city-date p")
    cityDatePEl.textContent =    cityName + " (" + now.toLocaleString() + ")";
    var wIconUrl = getWeatherIconUrl(currentWeather.weather[0].icon);
    document.querySelector("#weather-icon").src = wIconUrl;
    document.querySelector("#city-temp").textContent = currentWeather.temp;
    document.querySelector("#city-wind").textContent = currentWeather.wind_speed;
    document.querySelector("#city-humid").textContent = currentWeather.humidity;
    // need to make this one change color based on currentWeather.uvi
    var uviEl = document.querySelector("#city-uvindex");
    uviEl.textContent = currentWeather.uvi;
    uviEl.classList.remove("uv-1","uv-2","uv-3","uv-4","uv-5","uv-6","uv-7","uv-8","uv-9","uv-10","uv-11");
    uviEl.classList.add(getUviColorClass(currentWeather.uvi));

    var forecasts = document.getElementById("forecast-container").getElementsByTagName('div');
    
    for (var i = 0; i < forecasts.length; i++)
    {
        renderWeatherForForecast(i+1, weatherInfo.daily[i], now, forecasts[i]);
    }
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





