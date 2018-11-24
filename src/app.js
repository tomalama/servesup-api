const axios = require('axios');
const constants = require('../src/constants/constants');

const location = '43.004525099999995,-81.27643669999999';
const radius = '1500';

const getRestaurants = async (location, radius, key) => {
    try {
        const {data} = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location,
                radius,
                key,
                type: 'restaurant'
            }
        });
        console.log(data.results);
    } catch (error) {
        console.log(error);
    }
};

getRestaurants(location, radius, constants.API_KEY);

