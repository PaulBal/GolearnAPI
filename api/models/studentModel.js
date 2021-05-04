'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var studentSchema = new Schema({
  username: {
    type: String,
    required: 'Please enter username'
  },
  firstName: {
    type: String,
    required: 'Please enter first name'
  },
  lastName: {
    type: String,
    required: 'Please enter last name'
  },
  email: {
    type: String,
    required: 'Please enter an email address'
  },
  password: {
    type: String,
    required: 'Please enter a password'
  },
  lectures: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Lecture'
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema);