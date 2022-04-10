const UserModel = require('./user.model');

// QUERY
async function GetAllUsers(parent) {
  return await UserModel.find({ status: 'active' }).lean();
}

async function GetOneUser(parent, { _id }) {
  return await UserModel.findById(_id).lean();
}

// MUTATION
async function AddUser(parent, { user_input }) {
  const userExist = await UserModel.findOne({ email: user_input.email, status: 'active' }).select('_id email').lean();
  if (userExist) {
    throw new Error(`user with email ${userExist.email} already exist`);
  }
  return await UserModel.create(user_input);
}

async function UpdateUser(parent, { _id, user_input }) {
  return await UserModel.findByIdAndUpdate(_id, { $set: user_input }, { new: true }).lean();
}

async function DeleteUser(parent, { _id }) {
  return await UserModel.findByIdAndUpdate(_id, { $set: { status: 'deleted' } }, { new: true }).lean();
}

// LOADER
async function user_id(parent, args, context) {
  if (parent.user_id) {
    return await context.loaders.UserLoader.load(parent.user_id);
  }

  return null;
}

module.exports = {
  Query: {
    GetAllUsers,
    GetOneUser,
  },
  Mutation: {
    AddUser,
    UpdateUser,
    DeleteUser,
  },
};
