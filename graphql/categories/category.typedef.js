const { gql } = require('apollo-server-express');

const categoryTypeDef = gql`
  extend type Query {
    GetOneCategory(_id: ID): Category
    GetAllCategories: [Category]
  }

  extend type Mutation {
    CreateCategory(category_input: CategoryInput): Category
    UpdateCategory(_id: ID, category_input: CategoryInput): Category
    DeleteCategory(_id: ID): Category
  }

  input CategoryInput {
    name: String
  }

  type Category {
    _id: ID
    name: String
  }
`;

module.exports = categoryTypeDef;
