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

        console.log(lat + "   " + lon);
        var queryURLWeather = "https://api.openweathermap.org/data/2.5/forecast?lat="+ lat + "&lon="+ lon +"&appid=" + APIKey;
        $.ajax({
            url: queryURLWeather,
            method: "GET"
        }).then(function(response) {
           // console.log(response);
           var fiveDay = response.list;
            for(var i=0; i<fiveDay.length; i= i+8){
                console.log(fiveDay[i]);
            }
        });
    });


}