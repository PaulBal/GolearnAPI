'use strict';

var mongoose = require('mongoose'),
  teacher = mongoose.model('Teacher');

exports.list_all_teachers = (req, res) => {
  teacher.find({}, (err, teacher) => {
    if (err)
      res.send(err);
    res.json(teacher);
  });
};

exports.add_a_teacher = (req, res) => {
  var new_teacher = new teacher(req.body);
  new_teacher.save((err, teacher) => {
    if (err)
      res.send(err);
    res.json(teacher);
  });
};

exports.read_a_teacher = (req, res) => {
  teacher.findById(req.params.teacherId, (err, teacher) => {
    if (err)
      res.send(err);
    res.json(teacher);
  });
};

exports.update_a_teacher = (req, res) => {
  teacher.findOneAndUpdate({_id: req.params.teacherId}, req.body, {new: true}, (err, teacher) => {
    if (err)
      res.send(err);
    res.json(teacher);
  });
};

exports.delete_a_teacher = (req, res) => {
  teacher.remove({
    _id: req.params.teacherId
  }, (err, teacher) => {
    if (err)
      res.send(err);
    res.json({ message: 'teacher successfully deleted' });
  });
};
