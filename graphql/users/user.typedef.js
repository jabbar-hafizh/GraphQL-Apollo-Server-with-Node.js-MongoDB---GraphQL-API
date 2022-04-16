const { gql } = require('apollo-server-express');

const userTypeDef = gql`
  extend type Query {
    GetOneUser(_id: ID): User
    GetAllUsers: [User]
  }

  extend type Mutation {
    UpdateUser(_id: ID, user_input: UserInput): User
    DeleteUser(_id: ID): User
  }

  input UserInput {
    first_name: String
    last_name: String
    gender: GenderEnum
    email: String
    birth_date: String
    birth_place: String
  }

  type User {
    _id: ID
    first_name: String
    last_name: String
    email: String
    gender: GenderEnum
    birth_date: String
    birth_place: String
  }

  enum GenderEnum {
    male
    female
  }
`;

module.exports = userTypeDef;
