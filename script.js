$(document).ready(function() {
  const apiKey = "3c0052b927f6e7f742d696bf9d0b9013";
  let date = new Date();
  let hour = date.getHours();
  let city = $("#searchVal")
    .val()
    .trim();

  $("#searchBtn").on("click", function(e) {
    city = $("#searchVal")
      .val()
      .trim();

    getData();
    $(".5day").empty();
  });

  function getData() {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?" +
      "q=" +
      city +
      "&units=imperial&appid=" +
      apiKey;

    $.ajax({
      method: "GET",

      url: queryURL
    }).then(function(response) {
      // console.log(response)
      let citySearch = response.name;
      $(".current-city").text("Current Weather: " + citySearch);
      let temp = response.main.temp;
      $(".temp").text("Temperature: " + temp + "°F");
      let humid = response.main.humidity;
      $(".humidity").text("Humidity: " + humid + "%");
      let wind = response.wind.speed;
      $(".wind").text("Wind: " + wind + "MPH");

      let lat = response.coord.lat;
      let lon = response.coord.lon;

      getUV(lat, lon);
      get5Day(lat, lon);
    });
  }

  function getUV(lat, lon) {
    let uvURL =
      "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" +
      apiKey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;

    $.ajax({
      method: "GET",
      url: uvURL
    }).then(function(response) {
      let uv = response[0].value;
      $(".UV").text("UV Index: " + uv);
    });
  }

  function get5Day(lat, lon) {
    let daysURL =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;

    $.ajax({
      method: "GET",
      url: daysURL
    }).then(function(response) {
      console.log(response);

      for (let i = 0; i < response.list.length; i += 8) {
        let forecastDate = response.list[i].dt_txt;
        let kelvin = response.list[i].main.temp;
        let forecastTemp =
          "Temperature (F): " + ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
        let forecastHumidity =
          "Humidity: " + response.list[i].main.humidity + "%";
        let forecastCards = $(`
                    <div class="col-sm-2 card-body day${i} daysAhead">
                        <h5>${forecastDate}</h5>
                        <img src='https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png'></img>
                        <p>${forecastTemp}</p>
                        <p>${forecastHumidity}</p>
                    </div>               
                    `);
        $(".5day").append(forecastCards);
      }
    });
  }
});
