'use strict';

var mongoose = require('mongoose'),
  Lecture = mongoose.model('Lecture');

exports.get_lectures = (req, res) => {
  Lecture.find({}, (err, lecture) => {
    if (err)
      res.send(err);
    res.json(lecture);
  });
};

exports.add_a_lecture = (req, res) => {
  var new_lecture = new Lecture(req.body);
  new_lecture.save((err, lecture) => {
    if (err)
      res.send(err);
    res.json(lecture);
  });
};
  
exports.read_a_lecture = (req, res) => {
  Lecture.findById(req.params.lectureId, (err, lecture) => {
    if (err)
      res.send(err);
    res.json(lecture);
  });
};

exports.update_a_lecture = (req, res) => {
  Lecture.findOneAndUpdate({_id: req.params.lectureId}, req.body, {new: true}, (err, lecture) => {
    if (err)
      res.send(err);
    res.json(lecture);
  });
};

exports.delete_a_lecture = (req, res) => {
  Lecture.remove({
    _id: req.params.lectureId
  }, (err, lecture) => {
    if (err)
      res.send(err);
    res.json({ message: 'lecture successfully deleted' });
  });
};