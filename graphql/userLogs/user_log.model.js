const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.ObjectId, ref: 'user' },
    variable: String,
    query_or_mutation: String,
    url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('user_log', userLogSchema);
