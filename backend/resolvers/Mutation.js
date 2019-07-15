const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Restaurant } = require('../db');

require('dotenv').config({ path: 'variables.env' });

const Mutations = {
  async signUp(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const userExists = await User.findOne({ email: args.email }).exec();
    let user = null;
    
    if (!userExists) {
      user = await new User({
        password,
        savedRestaurants: [],
        email: args.email,
        name: args.name,
      }).save();

      const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);

      // We set the jwt as a cookie on the response
      ctx.res.cookie('token', token, {
        httpOnly: true,
        maxAge: process.env.COOKIE_AGE,
      });
    }

    return {
      alreadyExists: !!userExists,
      user,
    };
  },

  async signIn(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const user = await User.findOne({ email: args.email }).exec();
    let success = false;

    if (user && await bcrypt.compare(args.password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);

      // We set the jwt as a cookie on the response
      ctx.res.cookie('token', token, {
        httpOnly: true,
        maxAge: process.env.COOKIE_AGE,
      });
      success = true;
    }

    return {
      success,
    };
  },

  async addRestaurant(parent, args, ctx, info) {
    let restaurant = null;

    if (ctx.req.userId && !await Restaurant.findOne({ restaurantID: args.restaurantID })) {

      restaurant = await new Restaurant({
        restaurantID: args.restaurantID,
        title: args.title,
        users: args.users,
      }).save();
    }

    // console.log(ctx.req.userId);
    // console.log(ctx.req.cookies);
    // console.log(ctx.req.headers.authorization);

    return {
      restaurantID: (restaurant ? restaurant._id : -1),
      success: !!restaurant,
    };
  },

  async visitRestaurant(parent, args, ctx, info) {
    let success = false;
    const restaurant = await Restaurant.findOne({ restaurantID: args.restaurantID });

    if (ctx.req.userId && restaurant) {
      const savedRestaurants = ctx.req.user.savedRestaurants.push(restaurant._id);
      await User.findByIdAndUpdate(ctx.req.userId, { savedRestaurants });

      const users = restaurant.users.push(ctx.req.userId);
      await Restaurant.findByIdAndUpdate(restaurant._id, { users });

      success = true;
    }

    return {
      success,
    };
  },
};

module.exports = Mutations;
