//modules
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketio = require('socket.io');

const ejs = require('ejs');
const getStars = require('./utils/stars');
const geoLocate = require('./utils/geocode');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

//express 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public')); //redirecting views to public dir
app.engine('.html', require('ejs').__express); //registers ejs as html
app.set('view engine', 'html'); // removes need to add file extension in render method

io.on('connection', async (socket) => {
	socket.emit('connected');
	
	console.log('New Websocket Connection!');

	socket.on('join', async (res) => {
		const location = await updateLocation({lat: 51 , lng: 1});
		res(location);
	})

	socket.on('getLocation', async (pos, res) => {
		const location = await updateLocation(pos);
		res(location);
	})

	async function updateLocation (data){
		try {
			const location = await geoLocate(data);
			console.log(location);
			await getStars(location.coords.ra, location.coords.dec).then((res) => {
				socket.emit('starData', { res: res, loc: location.coords });
			})
			return location.formattedLocation;
		} catch (e) {
			console.log('error', e);
		}
	}
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

