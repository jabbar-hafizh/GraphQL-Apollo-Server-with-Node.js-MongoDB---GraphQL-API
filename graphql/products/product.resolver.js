const _ = require('lodash');

const ProductModel = require('./product.model');
const CategoryModel = require('../categories/category.model');

// QUERY
async function GetAllProducts(parent, { filter, pagination, sorting }) {
  const query = {
    $and: [{ status: 'active' }],
  };
  const aggregateQuery = [{ $match: query }];

  if (filter) {
    if (filter.name) {
      query.$and.push({ name: { $regex: new RegExp(filter.name, 'i') } });
    }
    if (filter.category_name) {
      const categoies = await CategoryModel.distinct('_id', {
        status: 'active',
        name: { $regex: new RegExp(filter.category_name, 'i') },
      });
      query.$and.push({ category_ids: { $in: categoies } });
    }
    if (filter.price && filter.price.from && filter.price.to) {
      query.$and.push({
        price: {
          $gte: filter.price.from,
          $lte: filter.price.to,
        },
      });
    }
  }

  if (sorting) {
    let sort = {};
    if (sorting.name) {
      aggregateQuery.push({
        $addFields: {
          name_lower: { $toLower: '$name' },
        },
      });
      sort.name_lower = sorting.name === 'asc' ? 1 : -1;
    } else if (sorting.price) {
      sort.price = sorting.price === 'asc' ? 1 : -1;
    } else if (sorting.rating) {
      sort.rating = sorting.rating === 'asc' ? 1 : -1;
    }
    aggregateQuery.push({
      $sort: _.isEmpty(sort) ? { createdAt: -1 } : sort,
    });
  }

  if (pagination && (pagination.page || pagination.page === 0) && pagination.limit) {
    aggregateQuery.push({
      $facet: {
        data: [{ $skip: pagination.limit * pagination.page }, { $limit: pagination.limit }],
        countData: [{ $group: { _id: null, count: { $sum: 1 } } }],
      },
    });

    let products = await ProductModel.aggregate(aggregateQuery).allowDiskUse(true);
    return products[0].data.map((data) => {
      return { ...data, count_document: products[0].countData[0].count };
    });
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
