const _ = require('lodash');

const UserModel = require('./user.model');

const common = require('../../utils/common');

/**
 * To check existing user
 *
 * @param {string} email user email
 * @param {string} portable_phone user portable phone
 * @returns {Promise<object>} user data
 */
const checkExistingUser = async (email) => {
  let query = {
    $or: [
      {
        email: email,
      },
    ],
  };

  return await UserModel.findOne(query);
};

module.exports = {
  checkExistingUser,
};
