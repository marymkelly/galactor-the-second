const axios = require('axios');

async function geoLocate(location) {
    const query = (typeof location === 'object') ? `latlng=${location.lat},${location.lng}` : `address=${location}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?`+ query +`&key=${process.env.GEOCODER_API_KEY}`; 
    
    try{ 
        const data = await axios.get(url);

        if(!data.data.results[0]) {
            throw new Error('no location found');
        }

        const coords =  data.data.results[0].geometry.location;
        const celestial = getCelestialCoords(coords.lat, coords.lng);
        const formattedLocation = data.data.results[0].formatted_address;

        coords.dec = celestial.dec;
        coords.ra = celestial.ra;

        return { coords, formattedLocation };
    } catch (e) {
        console.error(e.message);
    }
}

function getCelestialCoords(lat, long) {
    let dec = lat;  //latitude from geolocation should coorespond with angle of declination (range: 0-90)
    let ra = (long < 0) ? ((long + 360)/15) : (long / 15); //right ascention in hours (range: 0-24)

    return { dec: round(dec, 6), ra: round(ra, 6) }
}

function round(num, decimalPlaces) {

const tensFactor = Math.pow(10, decimalPlaces);
return Math.round(num * tensFactor) / tensFactor;
}

module.exports = geoLocate;
 