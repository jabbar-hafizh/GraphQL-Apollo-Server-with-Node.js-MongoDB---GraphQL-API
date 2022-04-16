const typeDefs = require('./user.typedef');
const resolvers = require('./user.resolver');
const UserModel = require('./user.model');
const UserUtilities = require('./user.utilities');

module.exports = {
  typeDefs,
  resolvers,
  UserModel,
  UserUtilities,
};
