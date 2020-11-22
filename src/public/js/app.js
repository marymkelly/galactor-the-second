const socket = io();	
const $locationInput = document.querySelector('#location-input');
const $infoDiv = document.querySelector('#infoDiv2');
let current;

socket.on('connected', () => {
	let btns = document.querySelectorAll('button');
	$infoDiv.innerHTML = 'Loading....';

	socket.emit('getLocation', window.location.search, (res) => {
		document.querySelector('#button-left').classList.remove('hidden');
		document.querySelector('#button-right').classList.remove('hidden');
		document.querySelector('#aladin-lite-div').classList.add('scale-in');
		document.querySelector('#aladin-lite-div2').classList.add('scale-in');
		btns.forEach(btn => { btn.classList.remove('disabled') });
		updatePageOnLoad(res);
	});
});

document.querySelector('#location-form').addEventListener('submit',  (e) => {
	e.preventDefault();
	const location = $locationInput.value;

	$locationInput.value = '';
	$infoDiv.innerHTML = 'Loading....';

	socket.emit('getLocation', location, (res) => {
		updatePageOnLoad(res);
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
		socket.emit('getLocation', { lat: position.coords.latitude, lng: position.coords.longitude }, (res) => {
			updatePageOnLoad(res);
		});
	})
})

function updatePageOnLoad(res) {

	if(!res) {
		$infoDiv.innerHTML = '<strong>' + current + '</strong>';
		$infoDiv.insertAdjacentHTML('beforeend', '<p class="red-text">Invalid Search: No Update to View</p>');
		return;
	}

	current = res;
	$infoDiv.innerHTML = '<strong>' + current + '</strong>';
}




