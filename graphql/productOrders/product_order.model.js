const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
    is_in_the_basket: {
      type: Boolean,
    },
    order_status: {
      type: String,
      enum: ['bought', 'paid'],
    },
    payment_method: {
      type: String,
      enum: ['gopay', 'ovo', 'bank'],
    },
    product_id: {
      type: Schema.ObjectId,
      ref: 'product',
    },
    user_id: {
      type: Schema.ObjectId,
      ref: 'user',
    },
    quantity: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  }
);

module.exports = mongoose.model('product_order', productSchema);
