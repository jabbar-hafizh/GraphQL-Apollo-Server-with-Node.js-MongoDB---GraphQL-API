const { merge } = require('lodash');
const { gql } = require('apollo-server-express');

const user = require('./users');
const auth = require('./auth');
const product = require('./products');
const category = require('./categories');

const typeDef = gql`
  type Query
  type Mutation
`;

const typeDefs = [typeDef, user.typeDefs, auth.typeDefs, product.typeDefs, category.typeDefs];

let resolvers = {};

resolvers = merge(resolvers, user.resolvers, auth.resolvers, product.resolvers, category.resolvers);

module.exports = {
  typeDefs,
  resolvers,
};
