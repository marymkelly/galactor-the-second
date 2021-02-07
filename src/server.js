const http = require('http');
const socketio = require('socket.io');
const app = require("./app");

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

const querystring = require('querystring');
const getStars = require('./utils/stars');
const geoLocate = require('./utils/geocode');
const sassChild = require('./sassdemon.js');

const child = sassChild();

process
	.on('exit', (code) => { 	// Handle normal exits
		console.log(` exit code ${code} `);
		process.exit(code);
	})
	.on('SIGINT', () => { 	// Handle CTRL+C
		process.kill(child.pid, 'SIGHUP'); //sass 
		process.kill(process.ppid, 'SIGHUP'); //nodemon
		process.exit(0);
	})

//server connection
server.listen(port, () => {
	console.log(`Server listening at port: ${port}`);
});

io.on('connection', async (socket) => {
	console.log('New Websocket Connection!');
	socket.emit('connected');

	socket.on('getLocation', async (pos, res) => {

		if (typeof pos === 'string' && pos.charAt(0) === '?') { //if queried in browser
			const searchedParams = querystring.parse(pos.slice(1));
			pos = searchedParams.location ? searchedParams.location : 'Cape Canaveral';
		}

		if (!pos) { //by default
			pos = 'Cape Canaveral';
		}

		const place = await geoLocate(pos).then(async (location) => {
			if (!location.coords || !location.formattedLocation) { throw Error(location) }

			await getStars(location.coords.celestial.ra, location.coords.celestial.dec).then((res) => {
				if (!res.stars) {
					if (res.error) {
						console.log('testing errors', res);
						throw res
					}
					// console.log('res before s issue', res);
					// throw new Error('star issue', res);
				}
				socket.emit('starData', { res, loc: location.coords.celestial });
			})
			return location;
		}).catch((error) => {
			console.log('caught before app', typeof error, error);
			if (error.isAxiosError) {
				console.log('axioserr', error)
			}
			return { error };
		});
		res(place);
	})
});
