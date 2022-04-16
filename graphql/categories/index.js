const typeDefs = require('./category.typedef');
const resolvers = require('./category.resolver');
const CategoryModel = require('./category.model');

module.exports = {
  typeDefs,
  resolvers,
  CategoryModel,
};
