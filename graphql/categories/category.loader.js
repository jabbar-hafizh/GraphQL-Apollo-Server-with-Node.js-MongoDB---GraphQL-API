const DataLoader = require('dataloader');
const CategoryModel = require('./category.model');

const batchCategories = async (categoryIds) => {
  const categories = await CategoryModel.find({ _id: { $in: categoryIds } }).lean();

  const dataMap = new Map();
  categories.forEach((category) => {
    dataMap.set(category._id.toString(), category);
  });

  return categoryIds.map((id) => dataMap.get(id.toString()));
};

exports.CategoryLoader = () => new DataLoader(batchCategories);
