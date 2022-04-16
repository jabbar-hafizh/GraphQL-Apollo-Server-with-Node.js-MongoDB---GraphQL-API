const user = require('./users');
const auth = require('./auth');
const { merge } = require('lodash');

const typeDefs = [user.typeDefs, auth.typeDefs];

let resolvers = {};

resolvers = merge(resolvers, user.resolvers, auth.resolvers);

module.exports = {
  typeDefs,
  resolvers,
};
