var cities = ["Manchester", "Bangkok", "Przemysl", "Edinburgh", "Dublin"];
var APIKey = "fab2f8aed7f362e666aa16a01a05d5ed";

function renderButtons() {
  $(".weather-hr").empty();

  for (var i = 0; i < cities.length; i++) {

    var a = $("<button>");
    a.addClass("city-button");
   
    a.attr("data-name", cities[i]);
    a.text(cities[i]);
    $(".weather-hr").append(a);
  }
}

$(".search-button").on("click", function (event) {
    event.preventDefault();
    var city = $('#search-input').val().trim();
    if(city){
        cities.push(city);
        getCityWeather(city);
    }
    else{
        alert("Nothing in search box");
    }

   $(".city-button").on("click", function (event) {
        event.preventDefault();
        var city = $(this).attr("data-name");
        getCityWeather(city);
      
    });

});

renderButtons();

function getCityWeather(city){
    var queryURLGeo = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=" + APIKey;

    $.ajax({
    url: queryURLGeo,
    method: "GET"
    }).then(function(response) {
        lat = response.coord.lat;
        lon = response.coord.lon;
        $('.city-today').text(city);
        var currentTime = moment().format("DD MMM YYYY");
        $('.date-today').text(currentTime);
        $('.icon-today').text(response.weather.icon);
        $('.temp-today').text("Temperature: " + response.main.temp + " °C");
        $('.wind-today').text("Wind Speed: " + response.wind.speed + " KPH");
        $('.humidity-today').text("Humidity: " + response.main.humidity + "%");

        var queryURLWeather = "https://api.openweathermap.org/data/2.5/forecast?lat="+ lat + "&lon="+ lon +"&appid=" + APIKey;
        $.ajax({
            url: queryURLWeather,
            method: "GET"
        }).then(function(response) {
           var fiveDay = response.list;
           displayWeatherForecast(fiveDay);
        });
    });
}

//need to loop through the array and set the data to each of the textbox.
function displayWeatherForecast(fiveDay){
    var weatherDay = []; //create array to hold the weather objects
   // console.log(fiveDay);
        for(var i=4; i<fiveDay.length; i= i+8){ 
            weatherDay[i] = {
                date: fiveDay[i].dt_txt,
                icon: fiveDay[i].weather.icon,
                temp: fiveDay[i].main.temp,
                wind: fiveDay[i].wind.speed,
                humidity: fiveDay[i].main.humidity
            }

    
            }
        }
    
    
