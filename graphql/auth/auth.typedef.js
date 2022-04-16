const { gql } = require('apollo-server-express');

const suthTypeDefTypeDef = gql`
  type AuthPayload {
    token: String
    user: User
  }

  extend type Mutation {
    RegisterUser(user_input: UserInput, password: String!, delete_user_and_create: Boolean): User
    Login(email: String!, password: String!): AuthPayload!
  }
`;

module.exports = suthTypeDefTypeDef;
