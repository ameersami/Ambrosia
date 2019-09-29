const graphql = require('graphql.js');
require('dotenv').config({ path: 'variables.env' });

const { Restaurant } = require('../db');
const verifyUser = require('../utils/userVerification');

const graph = graphql('https://api.yelp.com/v3/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.YELP_TOKEN}`,
  },
});

const Query = {

  async getStoredRestaurant(parent, args, ctx, info) {
    let restaurant;

    if (await verifyUser(args.jwt) && args.restaurantID) {
      restaurant = await Restaurant.findOne({ restaurantID: args.restaurantID });
      restaurant.users = restaurant.users.map(user => user.toString());
    }

    return restaurant;
  },

  async getStoredRestaurants(parent, args, ctx, info) {
    let restaurants;

    if (await verifyUser(args.jwt) && args.restaurantIDs) {
      restaurants = await Restaurant.find({
        restaurantID: { $in: args.restaurantIDs },
      });
      restaurants.map(restaurant => restaurant.users.map(user => user.toString()));
    }

    return restaurants;
  },

  async searchRestaurants(parent, args, ctx, info) {
    const response = {
      total: 0,
      business: {},
    };

    if (await verifyUser(args.jwt)) {
      delete args.jwt;
      let params = '';
      Object.keys(args).forEach((key) => { params += `${key}: ${JSON.stringify(args[key])}, `; });
      const incomingQuery = ctx.req.body.query.split(')')[1].trim();
      const query = graph(`
        {
          search(${params})
            ${incomingQuery.slice(0, -1)}
        }
      `);

      const data = await query();
      response.business = data.search.business;
      response.total = data.search.total;
    }

    return response;
  },

  async getRestaurant(parent, args, ctx, info) {
    let response = {};

    if (await verifyUser(args.jwt)) {
      delete args.jwt;
      let params = '';
      Object.keys(args).forEach((key) => { params += `${key}: ${JSON.stringify(args[key])}, `; });
      const incomingQuery = ctx.req.body.query.split(')')[1].trim();
      const query = graph(`
        {
          business(${params})
            ${incomingQuery.slice(0, -1)}
        }
      `);

      const data = await query();
      response = data.business;
    }

    return response;
  },
};

module.exports = Query;
