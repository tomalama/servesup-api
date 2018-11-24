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
      "x-app-id": "a82c1c0d",
      "x-app-key": "8456f030d636fd746bb3d50ddf6059f2"
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

  // console.log(results.data.branded);

  const menuItems = await Promise.all(results.data.branded.map(async (menuItem, index) => {
    if (index < 1) {
      let item = await instance.get("search/item", {
        params: {
          nix_item_id: menuItem.nix_item_id,
          claims: true
        }
      });
  
      return item.data.foods[0];
    }
    return 'lol';
  }));

  console.log(menuItems);

  // results.data.branded.forEach((menuItem, index) => {
  //   if (index < 1) {
  //     let results = await instance.get("search/item", {
  //       params: {
  //         nix_item_id: menuItem.nix_item_id,
  //         claims: true
  //       }
  //     });
  //     console.log(results);
  //   }
  //   // menuItems.push(menuItem.);
  // });

  return 'Sup lol'; //JSON.stringify(results.data.branded);
};

