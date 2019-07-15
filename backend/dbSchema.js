const { Schema, SchemaTypes } = require('mongoose');

const User = new Schema({
  name: SchemaTypes.String,
  email: SchemaTypes.String,
  password: SchemaTypes.String,
  resetToken: SchemaTypes.String,
  resetTokenExpiry: SchemaTypes.Number,
  savedRestaurants: {
    type: [SchemaTypes.ObjectId],
    ref: 'Restaurant',
  },
});

const Restaurant = new Schema({
  restaurantID: SchemaTypes.Number,
  title: SchemaTypes.String,
  users: {
    type: [SchemaTypes.ObjectId],
    ref: 'User',
  },
});

module.exports = {
  User,
  Restaurant,
};
