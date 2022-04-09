const { gql } = require('apollo-server-express');

const userTypeDef = gql`
  type Query {
    GetOneUser(last_name: String): User
    GetAllUsers: [User]
  }

  type Mutation {
    AddUser(user_input: UserInput): User
    UpdateUser(id: ID, user_input: UserInput): User
    DeleteUser(id: ID): User
  }

  input UserInput {
    id: Int
    first_name: String
    last_name: String
    email: String
    birth_date: String
    birth_place: String
  }

  type User {
    id: Int
    first_name: String
    last_name: String
    email: String
    birth_date: String
    birth_place: String
  }
`;

module.exports = userTypeDef;
