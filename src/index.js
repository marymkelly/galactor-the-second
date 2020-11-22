//modules
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const querystring = require('querystring');

//const ejs = require('ejs');
const getStars = require('./utils/stars');
const geoLocate = require('./utils/geocode');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

//express 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
//app.set('views', path.join(__dirname, 'public')); //redirecting views to public dir
//app.engine('.html', require('ejs').__express); //registers ejs as html
//app.set('view engine', 'html'); // removes need to add file extension in render method

io.on('connection', async (socket) => {

	socket.emit('connected');

	console.log('New Websocket Connection!');

	socket.on('getLocation', async (pos, res) => {

		if (typeof pos === 'string' && pos.charAt(0) === '?') {
			const searchedParams = querystring.parse(pos.slice(1));
			pos =  searchedParams.location ? searchedParams.location : 'Cape Canaveral';
		}

		if (pos === '') {
			pos = 'Disney';
		}

		const location = await updateLocation(pos);
		console.log(location)
		res(location);
	})

		async function updateLocation(data){
			const loc = await geoLocate(data).then(async (location) => {
				if(!location){
					throw new Error('no location');
				}
				await getStars(location.coords.ra, location.coords.dec).then((res) => {
					socket.emit('starData', { res , loc: location.coords });
				})
				return location.formattedLocation;
			}).catch((e) => {
				console.log('error', e)
				return;
			});

			console.log(loc);
			return loc;	
		}
});

//routes
app.get('/', function (req, res) {
	console.log("indexroute")
	console.log(req)
	res.render('index');
});

app.get('/stars', (req, res) => {
   console.log("starroute")
   res.render('stars');
});

//server connection
server.listen(port, () => {
   console.log(`Server listening at port: ${port}`);
});

