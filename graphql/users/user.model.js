const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    auth_token: [
      {
        type: String,
        default: [],
      },
    ],
    salt: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male',
    },
    birth_date: {
      type: String,
    },
    birth_place: {
      type: String,
    },
    store_name: {
      type: String,
    },
    addresses: [
      {
        address: {
          type: String,
        },
        type: {
          type: String,
        },
        city: {
          type: String,
        },
        country: {
          type: String,
        },
        postal_code: {
          type: String,
        },
      },
    ],
    image: {
      original_file_name: { type: String },
      bucket_file_name: { type: String },
      file_url: { type: String },
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

module.exports = mongoose.model('user', userSchema);
