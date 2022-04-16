const UserModel = require('./user.model');

// QUERY
async function GetAllUsers(parent) {
  return await UserModel.find({ status: 'active' }).lean();
}

async function GetOneUser(parent, { _id }) {
  return await UserModel.findById(_id).lean();
}

// MUTATION
async function UpdateUser(parent, { _id, user_input }) {
  return await UserModel.findByIdAndUpdate(_id, { $set: user_input }, { new: true }).lean();
}

async function DeleteUser(parent, { _id }) {
  return await UserModel.findByIdAndUpdate(_id, { $set: { status: 'deleted' } }, { new: true }).lean();
}

module.exports = {
  Query: {
    GetAllUsers,
    GetOneUser,
  },
  Mutation: {
    UpdateUser,
    DeleteUser,
  },
};
