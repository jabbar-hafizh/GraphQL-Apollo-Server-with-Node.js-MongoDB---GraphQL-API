const typeDefs = require('./product.typedef');
const resolvers = require('./product.resolver');
const ProductModel = require('./product.model');

module.exports = {
  typeDefs,
  resolvers,
  ProductModel,
};
