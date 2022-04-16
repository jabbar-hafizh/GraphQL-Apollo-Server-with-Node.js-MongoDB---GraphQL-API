const { UserLoader } = require('../graphql/users/user.loader');
const { ProductLoader } = require('../graphql/products/product.loader');
const { CategoryLoader } = require('../graphql/categories/category.loader');
const { ProductOrderLoader } = require('../graphql/productOrders/product_order.loader');

module.exports = {
  loaders: () => {
    return {
      UserLoader: UserLoader(),
      ProductLoader: ProductLoader(),
      CategoryLoader: CategoryLoader(),
      ProductOrderLoader: ProductOrderLoader(),
    };
  },
};
