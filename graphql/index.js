const user = require('./users');
const { merge } = require('lodash');

const typeDefs = [user.typeDefs];

let resolvers = {};

resolvers = merge(resolvers, user.resolvers);

module.exports = {
  typeDefs,
  resolvers,
};
