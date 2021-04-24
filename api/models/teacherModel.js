'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var teacherSchema = new Schema({
  firstName: {
    type: String,
    required: 'Please enter first name'
  },
  lastName: {
    type: String,
    required: "Please enter second name"
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);