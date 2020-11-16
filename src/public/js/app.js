const socket = io();

socket.emit('join', (res) => {
	document.querySelector('#button-left').classList.remove('hidden');
	document.querySelector('#button-right').classList.remove('hidden');
	document.querySelector('#aladin-lite-div').classList.add('scale-in');
	document.querySelector('#aladin-lite-div2').classList.add('scale-in');
	$infoDiv.innerHTML = '<strong>' + res + '</strong>';
})

const $locationInput = document.querySelector('#location-input');
const $infoDiv = document.querySelector('#infoDiv2');

document.querySelector('#location-form').addEventListener('submit',  (e) => {
	e.preventDefault();
	const location = $locationInput.value;

	$locationInput.value = '';
	$infoDiv.innerHTML = 'Loading....';

	socket.emit('getLocation', location, (res) => {
		$infoDiv.innerHTML = '<strong>' + res + '</strong>';
	});
  })

//get user location
document.querySelector('#send-location').addEventListener('click', (e) => {
	e.preventDefault();

	if(!navigator.geolocation){
		return alert('Geolocation not supported by browser');
	}
	$infoDiv.innerHTML = 'Loading....';
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('getLocation', { lat: position.coords.latitude, lng: position.coords.longitude }, (location) => {
			$infoDiv.innerHTML = '<strong>' + location + '</strong>';
		});
	})
})





