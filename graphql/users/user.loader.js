const DataLoader = require('dataloader');
const UserModel = require('./user.model');

const batchUsers = async (userIds) => {
  const users = await UserModel.find({ _id: { $in: userIds } }).lean();

  const dataMap = new Map();
  users.forEach((user) => {
    dataMap.set(user._id.toString(), user);
  });

  return userIds.map((id) => dataMap.get(id.toString()));
};

exports.UserLoader = () => new DataLoader(batchUsers);
