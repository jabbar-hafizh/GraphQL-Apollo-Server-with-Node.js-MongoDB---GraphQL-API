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
