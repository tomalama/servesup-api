// Import libraries
const axios = require("axios");
const lib = require("lib")({
  token: process.env.STDLIB_LIBRARY_TOKEN
});
const storage = lib.utils.storage["@0.1.6"];
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * A function that gives you nutritional information about restaurant menu items around the location.
 * @param {string} ll Latitude, longitude
 * @param {string} distance Radius around location to search in meters
 * @returns {string}
 */
module.exports = async (
  ll = "43.004525099999995,-81.27643669999999",
  distance = "300"
) => {
  const instance = axios.create({
    baseURL: "https://trackapi.nutritionix.com/v2/",
    timeout: 3000,
    headers: {
      "x-app-id": "a82c1c0d",
      "x-app-key": "8456f030d636fd746bb3d50ddf6059f2"
    }
  });

  // Gets information about restaurants around the coordinates
  let locationRequest = await getRestaurantsByNutritionix(
    instance,
    ll,
    distance
  );

  // If the first API call did not query, query the locations an alternative way
  if (!locationRequest) {
    console.log(
      "Couldn't get locations from Nutritionix API. Trying Google Maps."
    );
    locationRequest = await getRestaurantsByMaps(ll, distance);
  }

  if (!locationRequest) {
    return "Could not query any locations through Google Maps. Quitting.";
  }

  // Get locations based on input
  const { data } = locationRequest;
  const locations = data.locations || data.results;

  // Store an array for all menu items (in all locations)
  let allMenuItems = [];

  // Iterate through each location
  for (let location of locations) {
    // Check if menu for restaurant is already stored or not before performing an API request
    const menu = await storage.get(location.name);
    if (menu) {
      // Push menu into allMenuItems array
      for (let item in menu) {
        allMenuItems.push({ nix_item_id: menu[item] });
      }
    } else {
      // Build common params
      let params = {
        query: location.name
      };

      // Depending on where the input came from, there is extra brand_ids info
      if (location.brand_id) {
        params.brand_ids = [location.brand_id];
      }

      // Request menu items for location
      const menuForLocationRequest = await instance.get("search/instant", {
        params
      });
      const { branded } = menuForLocationRequest.data;

      // Check if menu is empty
      if (branded.length > 0) {
        // Add menu items for this location into allMenuItems array
        allMenuItems = allMenuItems.concat(branded);

        // Store the store name as the key and an array of menu items as the value
        await storage.set(
          location.name,
          branded.map(menuItem => menuItem.nix_item_id)
        );
      }
    }
  }

  // Get nutritional information for all menu items
  const allMenuItemsWithNutritions = await Promise.all(
    // Iterate through the menu items
    allMenuItems.map(async menuItem => {
      // Get the nutritionInfo if it exists in the storage
      const nutritionInfo = await storage.get(menuItem.nix_item_id);

      // Return nutritionInfo if exists
      if (nutritionInfo) {
        return nutritionInfo;
      }

      // Otherwise, query it if it doesn't exist
      let menuItemRequest = await instance.get("search/item", {
        params: {
          nix_item_id: menuItem.nix_item_id,
          claims: true
        }
      });

      // Store the item in the storage
      let item = menuItemRequest.data.foods[0];
      await storage.set(menuItem.nix_item_id, item);

      return item;
    })
  );

  console.log(allMenuItemsWithNutritions);

  return JSON.stringify(allMenuItemsWithNutritions);
};

const getRestaurantsByNutritionix = async (instance, ll, distance) => {
  try {
    const request = await instance.get("locations", {
      params: {
        ll,
        distance: distance.concat("", "m")
      }
    });
    return request;
  } catch (error) {}
};

const getRestaurantsByMaps = async (location, radius) => {
  try {
    const request = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location,
          radius,
          key: GOOGLE_MAPS_API_KEY,
          type: "restaurant"
        }
      }
    );
    return request;
  } catch (error) {
    console.log(error);
  }
};
