const axios = require('axios');
const constants = require('../src/constants/constants');

// const location = '43.004525099999995,-81.27643669999999';
// const radius = '1500';

const getNearbyRestaurants = async (location, radius, key) => {
    try {
        const {data} = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location,
                radius,
                key,
                type: 'restaurant'
            }
        });
        const restaurantNames = data.results.map((restaurant) => restaurant.name);
        return restaurantNames
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getNearbyRestaurants
};
// getRestaurants(location, radius, constants.API_KEY);

