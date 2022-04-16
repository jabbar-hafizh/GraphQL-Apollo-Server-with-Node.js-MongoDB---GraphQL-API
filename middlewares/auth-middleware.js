const { AuthenticationError } = require('apollo-server-express');
const { UserModel } = require('../graphql/users');
const { getUserId } = require('../utils/common');

const requireAuth = async (resolver, parent, args, ctx) => {
  let Authorization = ctx.req.get('Authorization');
  if (!Authorization) {
    throw new AuthenticationError('Authorization header is missing');
  }
  let token = Authorization.replace('Bearer ', '');

  token = token.replace(/"/g, '');

  let userId = getUserId(token);

  let user = await UserModel.findOne({ _id: userId }).select('_id').lean();
  if (!user) {
    throw new AuthenticationError('UnAuthenticated');
  }
  ctx.userId = user._id;

  return resolver(); //call the next resolver
};

let authMiddleware = {
  Query: {
    GetAllUsers: requireAuth,
  },
  Mutation: {
    CreateProduct: requireAuth,
    CreateProductOrder: requireAuth,
    SingleUpload: requireAuth,
  },
};

module.exports = authMiddleware;
