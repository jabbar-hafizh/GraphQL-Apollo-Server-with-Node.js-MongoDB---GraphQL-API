const DataLoader = require('dataloader');
const ProductOrderModel = require('./product_order.model');

const batchProductOrders = async (productOrderIds) => {
  const productOrders = await ProductOrderModel.find({ _id: { $in: productOrderIds } }).lean();

  const dataMap = new Map();
  productOrders.forEach((product) => {
    dataMap.set(product._id.toString(), product);
  });

  return productOrderIds.map((id) => dataMap.get(id.toString()));
};

exports.ProductOrderLoader = () => new DataLoader(batchProductOrders);
