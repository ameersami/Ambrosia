const { Restaurant } = require('../db');

const Query = {

  async getRestaurant(parent, args, ctx, info) {
    let restaurant;

    if (ctx.req.userId && args.restaurantID) {
      restaurant = await Restaurant.findOne({ restaurantID: args.restaurantID });
      restaurant.users = restaurant.users.map(user => user.toString());
    }

    return restaurant;
  },

  async getRestaurants(parent, args, ctx, info) {
    let restaurants;

    if (ctx.req.userId && args.restaurantIDs) {
      restaurants = await Restaurant.find({
        restaurantID: { $in: args.restaurantIDs },
      });
      restaurants.map(restaurant => restaurant.users.map(user => user.toString()));
    }

    return restaurants;
  },

};

module.exports = Query;
