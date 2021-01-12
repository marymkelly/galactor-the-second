const axios = require('axios');
const xml2js = require('xml2js'); 

	async function getStars(ra = 28.4, dec = -80.6) { //default Cape Canaveral
		//retrieve nearby stars from database
		const getStarsUrl = `http://server2.sky-map.org/getstars.jsp?ra=${ra}&de=${dec}&angle=30&max_stars=10`;
		
		try {
			let response = await axios.get(getStarsUrl);
			let parsedData = await xml2js.parseStringPromise(response.data, {trim: true}) 

			//double check star names in seasame database -- invalid names will not render in aladin container
			const validateStars = parsedData.response.star.map(async(star) => { 
				const validateStarsUrl = 'http://vizier.cfa.harvard.edu/viz-bin/nph-sesame/-ox2F/S~?' + encodeURIComponent(star.catId);
				try {
					let response = await axios.get(validateStarsUrl);
					let parsedData = await xml2js.parseStringPromise(response.data, {trim: true}) 
					//return star original category id if star id name not found
					if(parsedData.Sesame.INFO || !parsedData.Sesame.Resolver) {
						return;
					}
						star.target = parsedData.Sesame.target;
						return star;
				} catch (error) { 
					console.log('vizier database error', error);
					return { error };
				}
			}); 

			// if(!validateStars){
			// 	throw new Error('no stars found'); 
			// }

			// wait for promises in map to resolve
			const validateResults = await Promise.all(validateStars);

			if(!validateResults){
				throw new Error('No stars found');
			}
			//filter out undefined values and return star objects as array
			return {stars: validateResults.filter((stars) => stars)};	

		} catch (error) {
			// if(error.isAxiosError){
			// 	console.log(error.response.status, error.response.data);
			// 	return { error }
			// }
 			console.error(error);
			return { error };
		}
	}

module.exports =  getStars 