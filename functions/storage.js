const lib = require("lib")({ token: STDLIB_LIBRARY_TOKEN });
const storage = lib.utils.storage["@0.1.6"];

export const storeRestaurantMenu = (restaurantName, menu) => {
  return storage.set(restaurantName, menu, (err, value) => {
    return err || value;
  });
};

export const retrieveRestaurantMenu = restaurantName => {
  return storage.get(restaurantName, (err, value) => {
    if (err) {
      return null;
    }
    return value;
  });
};

export const storeMenuItem = (itemName, itemInfo) => {
  return storage.set(itemName, itemInfo, (err, value) => {
    return err || value;
  });
};

export const retrieveMenuItem = itemName => {
  return storage.get(itemName, (err, value) => {
    if (err) {
      return null;
    }
    return value;
  });
};
