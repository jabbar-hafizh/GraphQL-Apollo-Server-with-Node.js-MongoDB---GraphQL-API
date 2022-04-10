const typeDefs = require('./user.typedef');
const resolvers = require('./user.resolver');
const UserModel = require('./user.model');

module.exports = {
  typeDefs,
  resolvers,
  UserModel,
};
