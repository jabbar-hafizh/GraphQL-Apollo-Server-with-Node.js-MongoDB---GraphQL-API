const typeDefs = require('./product_order.typedef');
const resolvers = require('./product_order.resolver');
const ProductOrderModel = require('./product_order.model');

module.exports = {
  typeDefs,
  resolvers,
  ProductOrderModel,
};
