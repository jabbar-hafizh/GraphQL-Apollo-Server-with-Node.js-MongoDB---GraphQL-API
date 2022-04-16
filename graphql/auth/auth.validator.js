const Joi = require('@hapi/joi');
const { passwordPattern } = require('../../utils/common');
const { ApolloError } = require('apollo-server-express');

/**
 * To validate the user email and password
 *
 * @param {object} user object with email and password
 */
const validateUser = (user) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .lowercase()
      .required()
      .error(() => new Error('Invalid Email')),
    password: Joi.string()
      .regex(passwordPattern)
      .required()
      .error(() => new Error('Invalid Password')),
  });

  const { error } = schema.validate(user);

  if (error && error.message) {
    throw new ApolloError(error.message);
  }
};

/**
 * To validate the email
 *
 * @param {object} value object with email
 */
const validateEmail = (user) => {
  const schema = Joi.object()
    .keys({
      email: Joi.string()
        .email()
        .lowercase()
        .required()
        .error(() => new Error('Invalid Email')),
    })
    .unknown(true);

  const { error } = Joi.validate(user, schema);

  if (error && error.message) {
    throw new ApolloError(error.message);
  }
};

/**
 * To validate the password pattern
 *
 * @param {object} value object with password
 */
const validateSetPassword = (value) => {
  const schema = Joi.object().keys({
    password: Joi.string()
      .regex(passwordPattern)
      .required()
      .error(() => new Error('Invalid Password')),
  });

  const { error } = Joi.validate(value, schema);

  if (error && error.message) {
    throw new ApolloError(error.message);
  }
};

module.exports = {
  validateUser,
  validateEmail,
  validateSetPassword,
};
