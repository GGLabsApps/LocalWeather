var btnSearch = document.getElementById('btnSearch');
var txtCity = document.getElementById('txtCity');

window.onload = function() {
	btnSearch = document.getElementById('btnSearch');
	txtCity = document.getElementById('txtCity');

	btnSearch.addEventListener("click", searchCity);
}

function searchCity() {
	var data = txtCity.value;

	localStorage.setItem('city', data);
	sessionStorage.setItem('city', data);

	console.log("localStorage: " + localStorage.getItem("city"));
	console.log("sessionStorage: " + sessionStorage.getItem("city"));
}