const axios = require("axios");

/**
 * A basic Hello World function
 * @param {string} name Who you're saying hello to
 * @returns {string}
 */
module.exports = async (name = "world") => {
  const instance = axios.create({
    baseURL: "https://trackapi.nutritionix.com/v2/",
    timeout: 3000,
    headers: {
      "x-app-id": "2259fc18",
      "x-app-key": "0379ecf284ebfe008aa0956a96cd24dc"
    }
  });

  let { data } = await instance.get("locations", {
    params: {
      ll: "40.7128,-74.006",
      distance: "50m"
    }
  });

  let { locations } = data;

  // console.log(locations);

  // console.log(locations.map(location => {
  //   return location.brand_id;
  // }))

  let results = await instance.get("search/instant", {
    params: {
      brand_ids: locations.map(location => {
        return location.brand_id;
      }),
      query: "Checker"
    }
  });

  console.log(results.data.branded);

  return JSON.stringify(results.data.branded);
};
