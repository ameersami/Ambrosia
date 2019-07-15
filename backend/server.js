const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const typeDefs = importSchema('schema.graphql');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const { User } = require('./db');

require('./db');
require('dotenv').config({ path: 'variables.env' });

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: (request) => {
    const context = { ...request };
    return context;
  },
});

app.use(cookieParser());

app.use(async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    const user = await User.findById(userId).exec();
    req.user = user;
    req.userId = user._id;
  }
  next();
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
