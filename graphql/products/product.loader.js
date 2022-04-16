const DataLoader = require('dataloader');
const ProductModel = require('./product.model');

const batchProducts = async (productIds) => {
  const products = await ProductModel.find({ _id: { $in: productIds } }).lean();

  const dataMap = new Map();
  products.forEach((product) => {
    dataMap.set(product._id.toString(), product);
  });

  return productIds.map((id) => dataMap.get(id.toString()));
};

exports.ProductLoader = () => new DataLoader(batchProducts);
