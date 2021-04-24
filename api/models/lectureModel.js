'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lectureModel = new Schema({
  teacherId: {
    type: String,
    required: 'Please enter the teacher\'s id'
  },
  date: {
    type: Date,
    required: 'Please enter the date'
  },
  time: {
    type: String,
    required: 'Please enter the time'
  },
  title: {
    type: String,
    required: 'Please enter a title'
  },
  description: {
    type: String,
    required: 'Please enter a description'
  },
  studentsEnrolled: {
      type: Number,
      default: 0
  },
  maxEnrollments: {
      type: Number,
      required: 'Please enter maxEnrollments'
  },
  price: {
      type: Number,
      default: 0
  },
  subjects: [{
      type: String
  }]
});

module.exports = mongoose.model('Lecture', lectureModel);