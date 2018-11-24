const lib = require("lib")({ token: STDLIB_LIBRARY_TOKEN });
const storage = lib.utils.storage["@0.1.6"];

const storeRestaurantMenu = (restaurantName, menu) => {
  return storage.set(restaurantName, menu, (err, value) => {
    return err || value;
  });
};

const retrieveRestaurantMenu = restaurantName => {
  return storage.get(restaurantName, (err, value) => {
    if (err) {
      return null;
    }
    return value;
  });
};

const storeMenuItem = (itemId, itemInfo) => {
  return storage.set(itemId, itemInfo, (err, value) => {
    return err || value;
  });
};

const retrieveMenuItem = itemId => {
  return storage.get(itemId, (err, value) => {
    if (err) {
      return null;
    }
    return value;
  });
};

module.exports = {
  storeRestaurantMenu,
  retrieveRestaurantMenu,
  storeMenuItem,
  retrieveMenuItem
};
