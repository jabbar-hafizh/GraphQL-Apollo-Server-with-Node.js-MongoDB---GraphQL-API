const CategoryModel = require('./category.model');

// QUERY
async function GetAllCategories(parent) {
  return await CategoryModel.find({ status: 'active' }).lean();
}

async function GetOneCategory(parent, { _id }) {
  return await CategoryModel.findById(_id).lean();
}

// MUTATION
async function CreateCategory(parent, { category_input }) {
  const category_exist = await CategoryModel.findOne({ status: 'active', name: { $regex: new RegExp(`^${category_input.name}$`, 'i') } });
  if (category_exist) {
    throw new Error(`Category ${category_exist.name} Already Exist`);
  }
  return await CategoryModel.create(category_input);
}

async function UpdateCategory(parent, { _id, category_input }) {
  const category_exist = await CategoryModel.findOne({
    _id: { $ne: _id },
    status: 'active',
    name: { $regex: new RegExp(`^${category_input.name}$`, 'i') },
  });
  if (category_exist) {
    throw new Error(`Category ${category_exist.name} Already Exist`);
  }
  return await CategoryModel.findByIdAndUpdate(_id, { $set: category_input }, { new: true }).lean();
}

async function DeleteCategory(parent, { _id }) {
  return await CategoryModel.findByIdAndUpdate(_id, { $set: { status: 'deleted' } }, { new: true }).lean();
}

module.exports = {
  Query: {
    GetAllCategories,
    GetOneCategory,
  },
  Mutation: {
    CreateCategory,
    UpdateCategory,
    DeleteCategory,
  },
};
