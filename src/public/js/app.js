const socket = io();
const $locationInput = document.querySelector('#location-input');
const $infoDiv = document.querySelector('#active-search');
const $loader = document.querySelector('#loading-loader');
let current = "";
let timeoutID, intervalID;

function loadingAlert() {
	timeoutID = window.setTimeout(() => { $infoDiv.innerHTML = 'Still working on it!'; callInterval(); return; }, 4 * 1000);
}

function clearAlert() {
	window.clearTimeout(timeoutID);
}

function callInterval() {
	intervalID = window.setInterval(myCallback, 3000, 1);
	let i = 0;

	function myCallback(int) {
		i += int;
		
		if(i == 1) {
			$infoDiv.innerHTML = 'Just a little longer...';
		}

		if(i == 2) {
			getStarsOnLoad()
			window.clearTimeout(intervalID);
		}
	}
}

function getStarsOnLoad(){
	let btns = document.querySelectorAll('button');

	socket.emit('getLocation', window.location.search, (res) => {
		document.querySelector('#button-left').classList.remove('hidden');
		document.querySelector('#button-right').classList.remove('hidden');
		document.querySelector('#aladin-lite-div').classList.add('scale-in');
		document.querySelector('#aladin-lite-div2').classList.add('scale-in');
		btns.forEach(btn => { btn.classList.remove('disabled') });
		updatePageOnLoad(res);
	});
}

socket.on('connected', () => {
	loadingAlert();

	$infoDiv.innerHTML = 'Loading....';
	$loader.removeAttribute('hidden');

	getStarsOnLoad();
});

document.querySelector('#location-form').addEventListener('submit', (e) => {
	e.preventDefault();
	const location = $locationInput.value;

	$locationInput.value = '';
	$infoDiv.innerHTML = 'Loading....';
	$loader.removeAttribute('hidden');

	socket.emit('getLocation', location, (res) => {
		updatePageOnLoad(res);
	});
})

//get user location
document.querySelector('#send-my-location').addEventListener('click', (e) => {
	e.preventDefault();
	const opt = {
		enableHighAccuracy: false,
		timeout: 6000,
		maximumAge: 0
	}

	function success(position) {
		socket.emit('getLocation', { lat: position.coords.latitude, lng: position.coords.longitude }, (res) => {
			updatePageOnLoad(res);
		});
		return;
	};

	function error(e) {
		console.log('navigator error', e);
		if (e.code === GeolocationPositionError.TIMEOUT) {
			updatePageOnLoad({ error: e });
			alert('Error: Timed out');
			return
		}
	}

	if (!navigator.geolocation) {
		return alert('Geolocation not supported by browser');
	}

	$infoDiv.innerHTML = 'Loading....';
	$loader.removeAttribute('hidden');
	navigator.geolocation.getCurrentPosition(success, error, opt);
})


function updatePageOnLoad(res) {
	clearAlert();

	if (!res.formattedLocation) {
		console.log('REDERR', res.error)
		let errorText = 'Invalid Search: No Update to View';
		// console.log('res', res, res instanceof GeolocationPositionError, res.constructor === GeolocationPositionError, (Object(GeolocationPositionError) == GeolocationPositionError));

		if (res.error instanceof GeolocationPositionError) {
			errorText = 'Gelocation Error: ' + res.error.message;
		}

		if (res.error.isAxiosMessage && res.error.response) {
			console.log('axios res data', res.error.response.data);
			errorText === axiosErrMsg(res.error.response.data);
		}

		$infoDiv.innerHTML = '<strong>' + current + '</strong>';
		$infoDiv.insertAdjacentHTML('beforeend', `<p class="red-text">${errorText}</p>`);
		$loader.setAttribute('hidden', true);
		return;
	}

	$locationInput.value = '';
	$loader.setAttribute('hidden', true);
	current = res.formattedLocation;
	$infoDiv.innerHTML = '<strong>' + current + '</strong>';
	return;
}

function axiosErrMsg(str = "") {
	let errorMsg = 'Server Error';

	const from = `</h1>`;
	const to = `</body>`;

	if (str.includes(from) && str.includes(to)) {
		const start = (str.indexOf(from) + from.length);
		const end = str.indexOf(to);

		const subStr = str.substring(start, end);
		errorMsg = subStr;
	}

	return errorMsg;
}

//fix passive event issues
jQuery.event.special.touchstart = {
	setup: function (_, ns, handle) {
		if (ns.includes("noPreventDefault")) {
			this.addEventListener("touchstart", handle, { passive: false });
		} else {
			this.addEventListener("touchstart", handle, { passive: true });
		}
	}
};

jQuery.event.special.touchmove = {
	setup: function (_, ns, handle) {
		if (ns.includes("noPreventDefault")) {
			this.addEventListener("touchmove", handle, { passive: false });
		} else {
			this.addEventListener("touchmove", handle, { passive: true });
		}
	}
};

jQuery.event.special.mousewheel = {
	setup: function (_, ns, handle) {
		if (ns.includes("noPreventDefault")) {
			this.addEventListener("wheel", handle, { passive: false });
		} else {
			this.addEventListener("wheel", handle, { passive: true });
		}
	}
};


//temp for testing

// socket.on('testing', () => {
// 	loadingAlert();
// 	console.log('testing')
// 	$infoDiv.innerHTML = 'Testing';
// 	$loader.setAttribute('hidden', true);
// });
