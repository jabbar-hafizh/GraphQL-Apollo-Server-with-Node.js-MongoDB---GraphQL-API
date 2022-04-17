const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    category_ids: [
      {
        type: Schema.ObjectId,
        ref: 'category',
      },
    ],
    user_id: {
      type: Schema.ObjectId,
      ref: 'user',
    },
    price: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    images: [
      {
        original_file_name: { type: String },
        bucket_file_name: { type: String },
        file_url: { type: String },
        cloudinary_public_id: { type: String },
      },
    ],
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

module.exports = mongoose.model('product', productSchema);
