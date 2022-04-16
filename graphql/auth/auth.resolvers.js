const _ = require('lodash');
const { validateUser, validateEmail, validateSetPassword } = require('./auth.validator');
const { UserInputError, ApolloError } = require('apollo-server-express');

const common = require('../../utils/common');

const { UserModel, UserUtilities } = require('../users');

const RegisterUser = async (parent, { user_input, password, delete_user_and_create }) => {
  //to make sure the email is lowercase
  user_input.email = user_input.email.toLowerCase();

  validateEmail(user_input);
  validateSetPassword({ password });

  let existingUser = await UserUtilities.checkExistingUser(user_input.email);

  // if user exists, then send appropriate error message.
  if (existingUser && existingUser.status !== 'deleted') {
    throw new ApolloError('Email Exist', 'EMAIL_EXIST');
  } else if (existingUser && existingUser.status === 'deleted' && delete_user_and_create) {
    // delete existing user if status is deleted and delete_user_and_create is true
    await UserModel.deleteMany({ email: user_input.email }).exec();
  } else if (existingUser && existingUser.status === 'deleted' && !delete_user_and_create) {
    // return error message if status is deleted and delete_user_and_create is true
    throw new ApolloError('user was already created but the status is deleted', 412);
  }

  let salt = common.makeSalt();
  let encryptedPassword = common.encrypt(password, salt);

  const user = await UserModel.create({
    ...user_input,
    password: encryptedPassword,
    salt,
  });

  return user;
};

const Login = async (parent, { email, password }) => {
  //validate the user email and password
  validateUser({ email, password });

  const user = await UserModel.findOne({ email, status: 'active' });

  if (!user) {
    throw new ApolloError('User Not Found', 'USER_NOT_FOUND');
  }

  const matched = common.compare(password, user.password, user.salt);

  if (!matched) {
    throw new UserInputError('Password Not Valid', {
      invalidArgs: ['password'],
    });
  }

  const token = common.getToken({ _id: user._id, email: user.email }, '1d');

  return {
    token,
    user,
  };
};

module.exports = {
  Query: {},
  Mutation: {
    Login,
    RegisterUser,
  },
};
