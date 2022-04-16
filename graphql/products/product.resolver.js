const ProductModel = require('./product.model');

// QUERY
async function GetAllProducts(parent, { filter }) {
  const query = {
    $and: [{ status: 'active' }],
  };
  const aggregateQuery = [{ $match: query }];

  if (filter) {
    if (filter.name) {
      query.$and.push({ name: { $regex: new RegExp(filter.name, 'i') } });
    }
  }

  return await ProductModel.aggregate(aggregateQuery);
}

async function GetOneProduct(parent, { _id }) {
  return await ProductModel.findById(_id).lean();
}

// MUTATION
async function CreateProduct(parent, { product_input }, context) {
  product_input.user_id = context.userId;
  return await ProductModel.create(product_input);
}

async function UpdateProduct(parent, { _id, product_input }) {
  return await ProductModel.findByIdAndUpdate(_id, { $set: product_input }, { new: true }).lean();
}

async function DeleteProduct(parent, { _id }) {
  return await ProductModel.findByIdAndUpdate(_id, { $set: { status: 'deleted' } }, { new: true }).lean();
}

// LOADER
async function category_ids(parent, args, context) {
  if (parent.category_ids) {
    return await context.loaders.CategoryLoader.loadMany(parent.category_ids);
  }

  return null;
}

async function user_id(parent, args, context) {
  if (parent.user_id) {
    return await context.loaders.UserLoader.load(parent.user_id);
  }

  return null;
}

module.exports = {
  Query: {
    GetAllProducts,
    GetOneProduct,
  },
  Mutation: {
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
  },
  Product: {
    category_ids,
    user_id,
  },
};
