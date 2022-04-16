const { gql } = require('apollo-server-express');

const productTypeDef = gql`
  extend type Query {
    GetOneProduct(_id: ID): Product
    GetAllProducts(filter: ProductFilterInput, pagination: PaginationInput): [Product]
  }

  extend type Mutation {
    CreateProduct(product_input: ProductInput): Product
    UpdateProduct(_id: ID, product_input: ProductInput): Product
    DeleteProduct(_id: ID): Product
  }

  input ProductInput {
    name: String
    quantity: Int
    category_ids: [ID]
    user_id: ID
  }

  type Product {
    _id: ID
    name: String
    quantity: Int
    category_ids: [Category]
    user_id: User
    count_document: Int
  }

  input ProductFilterInput {
    name: String
    category_name: String
  }

  input PaginationInput {
    limit: Int
    page: Int
  }
`;

module.exports = productTypeDef;
