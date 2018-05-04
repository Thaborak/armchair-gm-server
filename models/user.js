'use strict';
const mongoose = require('mongoose');

// ===== Define UserSchema & UserModel =====
const userSchema = new mongoose.Schema({
  googleID: {
    type: String,
    index: true
  },
  accessToken: {
    type: String,
    required: true
  },
  team: {
    type: Array,
    default: []
  },
  fullName: {
    type: String
  }
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

module.exports = mongoose.model('User', userSchema);



