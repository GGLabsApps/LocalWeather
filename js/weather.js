// Elements declaration
var locationTxt;
var descriptionTxt;
var descriptionIcon;
var humidityTxt;
var humidityTxt;
var windSpeedTxt;
var windDegreeTxt;
var temperatureSwitch;
var degreeTypeTxt;

// Local variables
var locationData;
var description;
var id;
var temperature;
var humidity;
var windSpeed;
var windDegree;

var ipUrl = "https://ipinfo.io/json";
var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?";

window.onload = function() {
	// API key from OpenWeatherMap
	let appId = "8e35b2f064dd73f3c760587e4b9d75f7";

	// Get elements from index
	locationTxt = document.getElementById('location');
	descriptionTxt = document.getElementById('text-desc');
	descriptionIcon = document.getElementById('icon-desc');
	temperatureTxt = document.getElementById('temperature-data');
	humidityTxt = document.getElementById('humidity-data-text');
	windSpeedTxt = document.getElementById('wind-speed-data-text');
	windDegreeTxt = document.getElementById('wind-degree-data-text');
	temperatureSwitch = document.getElementById('temperature-switch');
	degreeTypeTxt = document.getElementById('degree-type');

	var currentDate = new Date();
	var strDate = currentDate.toString();
	document.getElementById('date').innerHTML = strDate.split('GMT')[0];

	document.getElementById('btn-current-location').addEventListener("click", getLocation);
	temperatureSwitch.addEventListener("click", switchTemperature);

	getLocationByCity();

	function requestWeather(result) {
		var jsonWeather = JSON.parse(result.responseText);
		console.log(jsonWeather);

		locationData = jsonWeather.name;
		description = jsonWeather.weather[0].description;
		id = jsonWeather.weather[0].id;
		temperature = jsonWeather.main.temp;
		humidity = jsonWeather.main.humidity;
		windSpeed = jsonWeather.wind.speed;
		windDegree = jsonWeather.wind.deg;

		updateUi();
	}

	function updateUi() {
		locationTxt.innerHTML = setData(locationData);
		descriptionTxt.innerHTML = setData(`${formatCamelCase(description)}`);
		descriptionIcon.className = `wi wi-owm-${id}`;
		let tempDegrees = convertDegrees(temperature);
		temperatureTxt.innerHTML = setData(tempDegrees);
		humidityTxt.innerHTML = `${setData(humidity)}%`;
		windSpeedTxt.innerHTML = `${setData(windSpeed)} mph`;
		windDegreeTxt.innerHTML = `${setData(windDegree)}&deg`;

		/*Set a delay*/
		window.setTimeout(hideLoader, 1000);
		// hideLoader();
	}

	function setData(value) {
		if (value == undefined) {
			return "N/A";
		} else {
			return value;
		}
	}

	// Receives a url to make a request to and get response
	function httpRequestAsync(url, callback) {
		// XMLHttpRequest is an object that is used to request data from web servers
		var httpsReqIp = new XMLHttpRequest();
		// XMLHttpRequest.open(method, url, async);
		httpsReqIp.open("GET", url, true);

		// The onreadystatechange property specifies the function to be executed every time the status of the XMLHttpRequest object changes
		httpsReqIp.onreadystatechange = function () {
			if (httpsReqIp.readyState == 4 & httpsReqIp.status == 200) {
				callback(this);
			}
			/*
				0 - Request not initialized
				1 - Server connection established
				2 - Request recieved
				3 - Proccessing reuqest
				4 - Request finished and response is ready
			*/
		}
		// Performs the request
		httpsReqIp.send();
	}

	function requestLocation(result) {
		var jsonIp = JSON.parse(result.responseText);
		//console.log(jsonIp);

		var city = jsonIp.city;
		var country = jsonIp.country;

		var lat = jsonIp.loc.split(",")[0];
		var lon = jsonIp.loc.split(",")[1];

		// This is an ECMAScript 6 feauture called template literals, or Back-ticks notation
		locationData = `${city}, ${country}`;
		let url = `${weatherUrl}lat=${lat}&lon=${lon}&appid=${appId}`;
		httpRequestAsync(url, requestWeather);
	}

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showPositionError);
		} else {
			hideLoader();
			console.log("Geolocation is not supported by this browser");
		}
	}

	function showPosition(position) {
		let lat = position.coords.latitude;
		let lon = position.coords.longitude;

		let url = `${weatherUrl}lat=${lat}&lon=${lon}&appid=${appId}`;
		httpRequestAsync(url, requestWeather);
	}

	function showPositionError(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED: 
				console.log("User denied the request for location");
				break;
			case error.POSITION_UNAVAILBLE: 
				console.log("location is not availble");
				break;
			case error.TIMEOUT: 
				console.log("The request has been timed out");
				break;
			case error.UNKNOWN_ERROR: 
				console.log("Unknown Error occoured");
				break;
		}
	}

	function getLocationByCity() {
		var city = window.location.search.split("=")[1];
		if (city == undefined) {
			getLocationByIp();
		} else {
			var cityUrl = `${weatherUrl}q=${city}&appid=${appId}`;
			httpRequestAsync(cityUrl, requestWeather);
		}
	}

	function getLocationByIp() {
		httpRequestAsync(ipUrl, requestLocation);
	}

	var loaderContainer = document.getElementById('loader-container');
	var weatherContainer = document.getElementById('weather-container');

	function hideLoader() {
		loaderContainer.style.display = "none";
		weatherContainer.style.display = "block";
	}

	function showLoader() {
		loaderContainer.style.display = "block";
		weatherContainer.style.display = "none";
	}

	function switchTemperature() {
		updateUi();
	}

	function convertDegrees(kelvin) {
		if (temperatureSwitch.checked) {
			degreeTypeTxt.innerHTML = " C&deg;"
			return convertKelvinToCelsius(kelvin);
		} else {
			degreeTypeTxt.innerHTML = " F&deg;"
			return convertKelvinToFahrenheit(kelvin);
		}
	}

	function convertKelvinToCelsius(kelvin) {
		if (kelvin < 0) {
			return undefined;
		} else {
			return Math.round(kelvin - 273.15);
		}
	}

	function convertKelvinToFahrenheit(kelvin) {
		if (kelvin < 0) {
				return undefined;
			} else {
				return Math.round((kelvin * 9/5) - 459.67);
			}
	}

	function formatCamelCase(string) {
		if (string != undefined) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		} else {
			return undefined;
		}
	}
}