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
    addresses: [UserAddressInput]
    image: ImageInput
  }

  type User {
    _id: ID
    first_name: String
    last_name: String
    email: String
    gender: GenderEnum
    birth_date: String
    birth_place: String
    addresses: [UserAddress]
    image: Image
  }

  input UserAddressInput {
    address: String
    type: String
    city: String
    country: String
    postal_code: String
  }

  type UserAddress {
    address: String
    type: String
    city: String
    country: String
    postal_code: String
  }

  enum GenderEnum {
    male
    female
  }
`;

module.exports = userTypeDef;
