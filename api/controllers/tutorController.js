'use strict';

const { decode } = require('jsonwebtoken');

var mongoose = require('mongoose'),
  Tutor = mongoose.model('Tutor'),
  Student = mongoose.model('Student'),
  Lecture = mongoose.model('Lecture');

exports.lectures_created_by_tutor = (req, res) => {
  let token = req.headers["x-access-token"];

  if(token) {
    let tutorId = decode(token).id;
    
    Lecture.find({tutorId: tutorId}, (err, lectures) =>{
      if(err) {
        res.status(400).send(err);
        return;
      } else {

        res.status(200).send(lectures);
      }
    })
  }
};

exports.delete_lecture = (req, res) => {
  let token = req.headers["x-access-token"];

  if(token) {
    let tutorId = decode(token).id;

    Tutor.findByIdAndUpdate(tutorId, {$pull: {lectures: req.params.lectureId}}, {useFindAndModify: false}, (err) => {
      if(err) {
        res.status(400).send();
        return;
      } 
      
      Lecture.findByIdAndDelete(req.params.lectureId, {useFindAndModify: false}).exec();
      Student.find({lectures: req.params.lectureId}).updateMany({$pull: {lectures: req.params.lectureId}}).exec();

      res.status(200).send();
    })
  }
}

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
