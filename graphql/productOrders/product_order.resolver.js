const _ = require('lodash');
const mongoose = require('mongoose');
const Types = mongoose.Types;

const ProductOrderModel = require('./product_order.model');
const ProductModel = require('../products/product.model');

// QUERY
async function GetAllProductOrders(parent, { filter, pagination, sorting }) {
  const query = {
    $and: [{ status: 'active' }],
  };
  const aggregateQuery = [{ $match: query }];

  if (filter) {
    if (filter.is_in_the_basket || filter.is_in_the_basket === false) {
      query.$and.push({ is_in_the_basket: filter.is_in_the_basket });
    }
    if (filter.order_status) {
      query.$and.push({ order_status: filter.order_status });
    }
    if (filter.payment_method) {
      query.$and.push({ payment_method: filter.payment_method });
    }
    if (filter.user_id) {
      query.$and.push({ user_id: Types.ObjectId(filter.user_id) });
    }
  }

  if (sorting) {
    let sort = {};
    if (sorting.product_name) {
      aggregateQuery.push(
        {
          $lookup: {
            from: 'products',
            let: {
              product_id: '$product_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$product_id'],
                  },
                },
              },
              {
                $project: {
                  name: 1,
                },
              },
            ],
            as: 'product_populate',
          },
        },
        {
          $set: {
            product_name_lower: { $toLower: { $arrayElemAt: ['$product_populate.name', 0] } },
          },
        }
      );
      sort.product_name_lower = sorting.product_name === 'asc' ? 1 : -1;
    } else if (sorting.order_status) {
      sort.order_status = sorting.order_status === 'asc' ? 1 : -1;
    } else if (sorting.payment_method) {
      sort.payment_method = sorting.payment_method === 'asc' ? 1 : -1;
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

    let productOrders = await ProductOrderModel.aggregate(aggregateQuery).allowDiskUse(true);
    const count_document =
      productOrders[0] && productOrders[0].countData[0] && productOrders[0].countData[0].count ? productOrders[0].countData[0].count : 0;
    return productOrders[0].data.map((data) => {
      return { ...data, count_document };
    });
  }

  return await ProductOrderModel.aggregate(aggregateQuery);
}

async function GetOneProductOrder(parent, { _id }) {
  return await ProductOrderModel.findById(_id).lean();
}

// MUTATION
async function CreateProductOrder(parent, { product_order_input }, context) {
  product_order_input.user_id = context.userId;
  return await ProductOrderModel.create(product_order_input);
}

async function UpdateProductOrder(parent, { _id, product_order_input }) {
  if (product_order_input.order_status && product_order_input.order_status === 'paid') {
    const product_order = await ProductOrderModel.findById(_id).lean();
    const product_order_quantity = product_order_input.quantity ? product_order_input.quantity : product_order.quantity;
    const product = await ProductModel.findOne({
      status: 'active',
      _id: product_order.product_id,
    })
      .select('_id quantity')
      .lean();
    if (product) {
      if (product.quantity < product_order_quantity) {
        throw new Error(`Stock left is ${product.quantity}`);
      } else {
        await ProductModel.updateOne(
          {
            _id: product._id,
          },
          {
            $set: {
              quantity: product.quantity - product_order_quantity,
            },
          },
          { new: true }
        );
      }
    }
  }

  return await ProductOrderModel.findByIdAndUpdate(_id, { $set: product_order_input }, { new: true }).lean();
}

async function DeleteProductOrder(parent, { _id }) {
  return await ProductOrderModel.findByIdAndUpdate(_id, { $set: { status: 'deleted' } }, { new: true }).lean();
}

// LOADER
async function product_id(parent, args, context) {
  if (parent.product_id) {
    return await context.loaders.ProductLoader.load(parent.product_id);
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
    GetAllProductOrders,
    GetOneProductOrder,
  },
  Mutation: {
    CreateProductOrder,
    UpdateProductOrder,
    DeleteProductOrder,
  },
  ProductOrder: {
    product_id,
    user_id,
  },
};
