'use strict';

var mongoose = require('mongoose'),
  Tutor = mongoose.model('Tutor');

exports.list_all_tutors = (req, res) => {
  Tutor.find({}, (err, tutor) => {
    if (err)
      res.send(err);
    res.json(tutor);
  });
};

exports.add_a_tutor = (req, res) => {
  var new_tutor = new Tutor(req.body);
  new_tutor.save((err, tutor) => {
    if (err)
      res.send(err);
    res.json(tutor);
  });
};

exports.read_a_tutor = (req, res) => {
  Tutor.findById(req.params.tutorId, (err, tutor) => {
    if (err)
      res.send(err);
    res.json(tutor);
  });
};

exports.update_a_tutor = (req, res) => {
  Tutor.findOneAndUpdate({_id: req.params.tutorId}, req.body, {new: true}, (err, tutor) => {
    if (err)
      res.send(err);
    res.json(tutor);
  });
};

exports.delete_a_tutor = (req, res) => {
  Tutor.remove({
    _id: req.params.tutorId
  }, (err, tutor) => {
    if (err)
      res.send(err);
    res.json({ message: 'tutor successfully deleted' });
  });
};
