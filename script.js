var cities = ["Manchester", "Bangkok", "Przemysl", "Edinburgh", "New York"];
var APIKey = "fab2f8aed7f362e666aa16a01a05d5ed";
renderButtons(); //set initial list of cities to click
getCityWeather(cities[0]); //set an inital city on page load

$( document ).ready(function() {
    $(".search-button").on("click", function (event) {
        event.preventDefault();
        var city = $('#search-input').val().trim();
        if(city){ //check for a city in the text input
            if(!cities.includes(city)){
                cities.push(city); //update the array only if the city is not repeated
                localStorage.setItem("cities", JSON.stringify(cities));
            }
            renderButtons();
            getCityWeather(city);
        }
        else{
            alert("Nothing in search box");
        }
    });
});

function renderButtons() {
  var checkSaved = JSON.parse(localStorage.getItem("cities")); //check if any previously stored cities, and if so, update the array
  if(checkSaved){
    cities = checkSaved;
  }
  $(".list-group").empty();
  //create and append the buttons for each city in the array
  for (var i = 0; i < cities.length; i++) {
    var a = $("<button>");
    a.addClass("city-button btn-secondary btn-block");
    a.attr("data-name", cities[i]);
    a.text(cities[i]);
    $(".list-group").append(a);
  }
  //add the event listener once the buttons have been appended, so that it is always up to date
  $(".city-button").on("click", function (event) {
    event.preventDefault();
    var cityClicked = $(this).attr("data-name");
    getCityWeather(cityClicked); 
});
}

function getCityWeather(city){
    var queryURLGeo = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=" + APIKey;

    $.ajax({
    url: queryURLGeo,
    method: "GET"
    }).then(function(response) {
        //get the lat and lon to use for the 5 day forecast request
        lat = response.coord.lat;
        lon = response.coord.lon;
        //display the information for today's weather
        $('.city-today').text(city);
        var currentTime = moment().format("DD MMM YYYY");
        $('.date-today').text(currentTime);
        var iconAddress = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
        $('.icon-today').attr("src", iconAddress);
        var tempInCelcius = parseFloat((response.main.temp)-273.15).toFixed(2); //convert to celcius and round to 2.d.p
        $('.temp-today').text("Temperature: " + tempInCelcius + " °C");
        $('.wind-today').text("Wind Speed: " + response.wind.speed + " KPH");
        $('.humidity-today').text("Humidity: " + response.main.humidity + "%");

        var queryURLWeather = "https://api.openweathermap.org/data/2.5/forecast?lat="+ lat + "&lon="+ lon +"&appid=" + APIKey;
        //new query for the full 5 day forecast
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
    //create a new array to hold the data for each of the 5 days, populate it by taking every 8th object from the list of 40
    for (var i=0; i<fiveDay.length; i=i+8){
        weatherDay.push(fiveDay[i]);
    }
    //loop over the 5 day array and update the html with the relevant information
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

