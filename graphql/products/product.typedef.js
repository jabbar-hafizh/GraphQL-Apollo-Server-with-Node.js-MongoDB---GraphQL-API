const { gql } = require('apollo-server-express');

const productTypeDef = gql`
  extend type Query {
    GetOneProduct(_id: ID): Product
    GetAllProducts(filter: ProductFilterInput, pagination: PaginationInput, sorting: ProductSortingInput): [Product]
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
    price: Float
    rating: Float
    description: String
  }

  type Product {
    _id: ID
    name: String
    quantity: Int
    category_ids: [Category]
    user_id: User
    count_document: Int
    price: Float
    rating: Float
    description: String
  }

  input ProductFilterInput {
    name: String
    category_name: String
    price: ProductPriceFilterInput
  }

  input ProductPriceFilterInput {
    from: Float
    to: Float
  }

  input PaginationInput {
    limit: Int
    page: Int
  }

  enum SortingEnum {
    asc
    desc
  }

  input ProductSortingInput {
    name: SortingEnum
    price: SortingEnum
    rating: SortingEnum
  }
`;

module.exports = productTypeDef;
