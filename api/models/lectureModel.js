'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lectureModel = new Schema({
  tutorId: {
    type: Schema.Types.ObjectId,
    ref: 'Tutor'
  },
  title: {
    type: String,
    required: 'Please enter a title'
  },
  description: {
    type: String,
    required: 'Please enter a description'
  },
  startDate: {
    type: Date,
    required: 'Please enter start date'
  },
  endDate: {
    type: Date,
    required: 'Please enter end date'
  },
  enrollments: {
      type: Number,
      default: 0
  },
  maxEnrollments: {
      type: Number,
      required: 'Please enter maximum number of enrollments'
  },
  availableSpots: {
      type: Number
  },
  studentsEnrolled: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Student'
    }
  ]
});

module.exports = mongoose.model('Lecture', lectureModel);