const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Restaurant } = require('../db');
const verifyUser = require('../utils/userVerification');

require('dotenv').config({ path: 'variables.env' });

const Mutations = {
  async signUp(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const userExists = await User.findOne({ email: args.email }).exec();
    let token = '';
    let user = null;
    
    if (!userExists) {
      user = await new User({
        password,
        savedRestaurants: [],
        email: args.email,
        name: args.name,
      }).save();

      token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
    }

    return {
      alreadyExists: !!userExists,
      user,
      jwt: token,
    };
  },

  async signIn(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const user = await User.findOne({ email: args.email }).exec();
    let success = false;
    let token = '';

    if (user && await bcrypt.compare(args.password, user.password)) {
      token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
      success = true;
    }

    return {
      success,
      jwt: token,
    };
  },

  async addRestaurant(parent, args, ctx, info) {
    let restaurant = null;

    if (await verifyUser(args.jwt) && !await Restaurant.findOne({ restaurantID: args.restaurantID })) {
      restaurant = await new Restaurant({
        restaurantID: args.restaurantID,
        title: args.title,
        users: args.users,
      }).save();
    }

    return {
      restaurantID: (restaurant ? restaurant._id : -1),
      success: !!restaurant,
    };
  },

  async visitRestaurant(parent, args, ctx, info) {
    let success = false;
    const restaurant = await Restaurant.findOne({ restaurantID: args.restaurantID });
    const user = await verifyUser(args.jwt);

    if (user && restaurant) {
      if (!user.savedRestaurants.includes(restaurant._id)) {
        user.savedRestaurants.push(restaurant._id);
        await User.findByIdAndUpdate(user._id, { savedRestaurants: user.savedRestaurants });
      }

      if (!restaurant.users.includes(user._id)) {
        restaurant.users.push(user._id);
        await Restaurant.findByIdAndUpdate(restaurant._id, { users: restaurant.users });
      }

      success = true;
    }

    return {
      success,
    };
  },

  async unVisitRestaurant(parent, args, ctx, info) {
    let success = false;
    const restaurant = await Restaurant.findOne({ restaurantID: args.restaurantID });
    const user = verifyUser(args.jwt);

    if (user && restaurant) {
      if (user.savedRestaurants.includes(restaurant._id)) {
        user.savedRestaurants = user.savedRestaurants.filter(id => id.toString() !== restaurant._id.toString());
        await User.findByIdAndUpdate(user._id, { savedRestaurants: user.savedRestaurants });
      }

      if (restaurant.users.includes(user._id)) {
        restaurant.users = restaurant.users.filter(id => id.toString() !== user._id.toString());
        await Restaurant.findByIdAndUpdate(restaurant._id, { users: restaurant.users });
      }

      success = true;
    }


    return {
      success,
    };
  },
};

module.exports = Mutations;
