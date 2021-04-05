'use strict';

var mongoose = require('mongoose'),
  Student = mongoose.model('Student');

exports.list_all_students = (req, res) => {
  Student.find({}, (err, student) => {
    if (err)
      res.send(err);
    res.json(student);
  });
};

exports.add_a_student = (req, res) => {
  var new_student = new Student(req.body);
  new_student.save((err, student) => {
    if (err)
      res.send(err);
    res.json(student);
  });
};

exports.read_a_student = (req, res) => {
  Student.findById(req.params.studentId, (err, student) => {
    if (err)
      res.send(err);
    res.json(student);
  });
};

exports.update_a_student = (req, res) => {
  Task.findOneAndUpdate({_id: req.params.studentId}, req.body, {new: true}, (err, task) => {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.delete_a_student = (req, res) => {
  Student.remove({
    _id: req.params.studentId
  }, (err, student) => {
    if (err)
      res.send(err);
    res.json({ message: 'Student successfully deleted' });
  });
};
