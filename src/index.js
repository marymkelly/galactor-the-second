//modules
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const querystring = require('querystring');

const getStars = require('./utils/stars');
const geoLocate = require('./utils/geocode');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

//express 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', async (socket) => {

	socket.emit('connected');
	console.log('New Websocket Connection!');

	socket.on('getLocation', async (pos, res) => {

		if (typeof pos === 'string' && pos.charAt(0) === '?') {
			const searchedParams = querystring.parse(pos.slice(1));
			pos =  searchedParams.location ? searchedParams.location : 'Cape Canaveral';
		}

		if (!pos) {
			pos = 'Cape Canaveral';
		}

		const place = await geoLocate(pos).then(async (location) => {
				if(!location){
					throw new Error('no location');
				}
				await getStars(location.coords.celestial.ra, location.coords.celestial.dec).then((res) => {
					socket.emit('starData', { res , loc: location.coords.celestial });
				})
				return location;
			}).catch((e) => {
				console.log('error', e)
				return;
			});
		res(place.formattedLocation);
	})
});

//routes
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/stars', (req, res) => {
   res.render('stars');
});

//server connection
server.listen(port, () => {
   console.log(`Server listening at port: ${port}`);
});

