const socket = io();

socket.emit('join', (res) => {
	document.querySelector('#button-left').classList.remove('hidden');
	document.querySelector('#button-right').classList.remove('hidden');
	document.querySelector('#aladin-lite-div').classList.add('scale-in');
	document.querySelector('#aladin-lite-div2').classList.add('scale-in');
	$infoDiv.innerHTML = '<strong>' + res + '</strong>';
})

const $locationForm = document.querySelector('#location-form');
const $locationInput = document.querySelector('#location-input');
const $userLocation = document.querySelector('#send-location');
const $infoDiv = document.querySelector('#infoDiv2');

$locationForm.addEventListener('submit',  (e) => {
	e.preventDefault();
	const location = $locationInput.value;

	$locationInput.value = '';
	$infoDiv.innerHTML = 'Loading....';

	socket.emit('inputLocation', location, (res) => {
		$infoDiv.innerHTML = '<strong>' + res + '</strong>';
	});
  })

//get user location
$userLocation.addEventListener('click', (e) => {
	e.preventDefault();

	if(!navigator.geolocation){
		return alert('Geolocation not supported by browser');
	}
	$infoDiv.innerHTML = 'Loading....';
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('userLocation', { lat: position.coords.latitude, lng: position.coords.longitude }, (location) => {
			console.log('Location name', location);
			$infoDiv.innerHTML = '<strong>' + location + '</strong>';
		});
	})
})





