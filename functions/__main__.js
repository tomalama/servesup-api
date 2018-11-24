// Import libraries
const axios = require("axios");

/**
 * A function that gives you nutritional information about dishes around the location.
 * @param {string} ll Latitude, longitude
 * @param {string} distance Radius around location to search
 * @returns {string}
 */
module.exports = async (ll = "43.0044943,-81.2764182", distance = "50m") => {
  const instance = axios.create({
    baseURL: "https://trackapi.nutritionix.com/v2/",
    timeout: 3000,
    headers: {
      "x-app-id": "a82c1c0d",
      "x-app-key": "8456f030d636fd746bb3d50ddf6059f2"
    }
  });

  // Gets information about restaurants around the coordinates
  let locationRequest = await instance.get("locations", {
    params: {
      ll,
      distance
    }
  });
  let { locations } = locationRequest.data;

  // Store an array for all menu items (in all locations)
  let allMenuItems = [];

  // Iterate through each location
  locations.forEach(async location => {
    // Get menu items for location
    let menuForLocationRequest = await instance.get("search/instant", {
      params: {
        brand_ids: [location.brand_id],
        query: location.brand_name
      }
    });
    let { branded } = menuForLocationRequest.data;

    // TODO: store {brand_name, branded}

    // Add menu items for this location into allMenuItems array
    allMenuItems.concat(branded);
  });

  // Get nutritional information for all menu items
  const allMenuItemsWithNutritions = await Promise.all(
    allMenuItems.map(async (menuItem, index) => {
      if (index < 1) {
        let item = await instance.get("search/item", {
          params: {
            nix_item_id: menuItem.nix_item_id,
            claims: true
          }
        });

        return item.data.foods[0];
      }
      return "lol";
    })
  );

  console.log(allMenuItemsWithNutritions);

  return "Sup lol"; //JSON.stringify(allMenuItemsWithNutritions);
};
