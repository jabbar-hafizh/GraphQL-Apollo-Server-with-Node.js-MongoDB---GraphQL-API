const { gql } = require('apollo-server-express');

const productOrderTypeDef = gql`
  extend type Query {
    GetOneProductOrder(_id: ID): ProductOrder
    GetAllProductOrders(filter: ProductOrderFilterInput, pagination: PaginationInput, sorting: ProductOrderSortingInput): [ProductOrder]
  }

  extend type Mutation {
    CreateProductOrder(product_order_input: ProductOrderInput): ProductOrder
    UpdateProductOrder(_id: ID, product_order_input: ProductOrderInput): ProductOrder
    DeleteProductOrder(_id: ID): ProductOrder
  }

  input ProductOrderInput {
    is_in_the_basket: Boolean
    order_status: ProductOrderOrderStatusEnum
    payment_method: ProductOrderPaymentMethodEnum
    product_id: ID
    quantity: Int
    paid_date: Float
  }

  type ProductOrder {
    _id: ID
    is_in_the_basket: Boolean
    order_status: ProductOrderOrderStatusEnum
    payment_method: ProductOrderPaymentMethodEnum
    product_id: Product
    user_id: User
    quantity: Int
    count_document: Int
    paid_date: Float
  }

  input ProductOrderFilterInput {
    is_in_the_basket: Boolean
    order_status: ProductOrderOrderStatusEnum
    payment_method: ProductOrderPaymentMethodEnum
    user_id: ID
    paid_date: TimeRangeInput
  }

  input TimeRangeInput {
    start_time: Float
    end_time: Float
  }

  input ProductOrderSortingInput {
    order_status: SortingEnum
    payment_method: SortingEnum
    product_name: SortingEnum
    paid_date: SortingEnum
  }

  enum ProductOrderOrderStatusEnum {
    bought
    paid
  }

  enum ProductOrderPaymentMethodEnum {
    gopay
    ovo
    bank
  }
`;

module.exports = productOrderTypeDef;
