'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var tutorSchema = new Schema({
  firstName: {
    type: String,
    required: 'Please enter first name'
  },
  lastName: {
    type: String,
    required: 'Please enter second name'
  },
  email: {
    type: String,
    required: 'Please enter an email address'
  },
  lectures: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Lecture'
    }
  ]
});

module.exports = mongoose.model('Tutor', tutorSchema);