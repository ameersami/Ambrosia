const jwt = require('jsonwebtoken');
const { User } = require('../db');

require('dotenv').config({ path: 'variables.env' });

const verifyUser = async (token) => {
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    const user = await User.findById(userId).exec();
    return user;
  }
  return false;
};

module.exports = verifyUser;
