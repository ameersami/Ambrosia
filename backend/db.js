const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });
const { User, Restaurant } = require('./dbSchema');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
const url = `mongodb://${process.env.MONGO_DOMAIN}:27017/graphqldb`;
mongoose.connect(url, { useNewUrlParser: true });

// Create the models for mongodb
const UserModel = mongoose.model('User', User);
const RestaurantModel = mongoose.model('Restaurant', Restaurant);

mongoose.connection.once('error', (e) => {
  console.log('Mongo connection error:', e);
});
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));

module.exports = {
  db: mongoose,
  User: UserModel,
  Restaurant: RestaurantModel,
};
