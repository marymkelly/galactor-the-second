const axios = require('axios');

async function geoLocate(location) {
    if(typeof location === 'string'){
        const url = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=` + encodeURI(location) + `&types=geocode&key=${process.env.GEOCODER_API_KEY}`
        
        return await axios.get(url).then(async (res) => { 
            return res.data.predictions[0] ? await getPlace(res.data.predictions[0].place_id) : new Error('no location found');
        }).catch((e) => { return console.log(e)});

    } else {
        return await getPlace(location);
    }

    async function getPlace(input) {
        let query = (typeof input === 'object') ? `latlng=${input.lat},${input.lng}&location_type=APPROXIMATE` : `place_id=${input}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?${query}&key=${process.env.GEOCODER_API_KEY}`; 

        return await axios.get(url).then((res) => {
            if(!res.data.results[0]) {
                throw new Error('no location found');
            }

            const coords =  res.data.results[0].geometry.location;
            coords.celestial = getCelestialCoords(coords.lat, coords.lng);
            const formattedLocation = res.data.results[0].formatted_address;

            return ({ coords, formattedLocation })

        }).catch((e) => {
            console.log(e);
            return;
        })
    }
}

function getCelestialCoords(lat, long) {
    let dec = lat;  //latitude from geolocation should coorespond with angle of declination (range: 0-90)
    let ra = (long < 0) ? ((long + 360)/15) : (long / 15); //right ascention in hours (range: 0-24)

    return { dec: round(dec, 7), ra: round(ra, 7) }
}

function round(num, decimalPlaces) {

const tensFactor = Math.pow(10, decimalPlaces);
return Math.round(num * tensFactor) / tensFactor;
}

module.exports = geoLocate;
 