var cities = ["Manchester", "Bangkok", "Przemysl", "Edinburgh", "New York"];
var APIKey = "fab2f8aed7f362e666aa16a01a05d5ed";
renderButtons();

$( document ).ready(function() {
    
    $(".city-button").on("click", function (event) {
        event.preventDefault();
        console.log("clicked");
        var cityClicked = $(this).attr("data-name");
        getCityWeather(cityClicked);
    });
    
    $(".search-button").on("click", function (event) {
        event.preventDefault();
        var city = $('#search-input').val().trim();
        if(city){
            if(!cities.includes(city)){
                cities.push(city);
            }
            getCityWeather(city);
            renderButtons();
        }
        else{
            alert("Nothing in search box");
        }
    });
}); 

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
        var iconAddress = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
        $('.icon-today').attr("src", iconAddress);
        var tempInCelcius = parseFloat((response.main.temp)-273.15).toFixed(2);
        $('.temp-today').text("Temperature: " + tempInCelcius + " °C");
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


function displayWeatherForecast(fiveDay){
    var weatherDay = []; 
    for (var i=0; i<fiveDay.length; i=i+8){
        weatherDay.push(fiveDay[i]);
    }

    for(var i=0; i<weatherDay.length; i++){ 
        //convert the date to the same format as the date for today's weather
        var dayDate = weatherDay[i].dt_txt.split(" ");
        dayDate = dayDate[0].split("-");
        let year = dayDate[0];
        let month = dayDate[1];
        let day = dayDate[2];
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        $('.date'+i).text(day + " " + months[parseInt(month)-1] + " " + year);
        var iconAddress = "http://openweathermap.org/img/wn/" + weatherDay[i].weather[0].icon + "@2x.png";
        $('.icon'+i).attr("src", iconAddress);
        var tempInCelcius = parseFloat((weatherDay[i].main.temp)-273.15).toFixed(2);
        $('.temp'+i).text("Temperature: " + tempInCelcius + " °C");
        $('.wind'+i).text("Wind Speed: " + weatherDay[i].wind.speed + " KPH");
        $('.humidity'+i).text("Humidity: "+ weatherDay[i].main.humidity + " %");
    }
}
