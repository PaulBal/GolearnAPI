'use strict';

const { db } = require('../models/lectureModel');

var mongoose = require('mongoose'),
  Lecture = mongoose.model('Lecture'),
  Tutor = mongoose.model('Tutor');

exports.get_lectures = (req, res) => {
  Lecture.find({}, (err, lecture) => {
    if (err)
      res.send(err);
    res.json(lecture);
  });
};

exports.add_a_lecture = (req, res) => {
  var new_lecture = new Lecture({
    ...req.body,
    availableSpots: req.body.maxEnrollments
  });

  Tutor.findById(req.body.tutorId, (err, tutor) => {
    if(err || !tutor) {
      res.status(400).send('We couldn\'t find any tutor with the speified id');
      return;
    } else {
      Lecture.find({'tutorId': tutor.id, 'startDate': { '$lt': req.body.endDate }, 'endDate': { '$gt': req.body.startDate }}, (err, docs) => {
        if(docs.length > 0) {
          res.status(400).send('The tutor with id ' + req.body.tutorId + ' is not available at the specified time');
        } else if(err) {
          res.status(400).send(err);  
        } else {
          new_lecture.update({ 'tutorId': tutor.id }).save((err, lecture) => {
            if (err) {
              res.status(400).send(err);
            }
            res.json(lecture);
            Tutor.findByIdAndUpdate(
              tutor.id,
              { $push: { lectures: new_lecture.id } },
              { new: true, useFindAndModify: false },
              (err, res) => {
                if(err) {
                  res.status(400).send(err);
                  new_lecture.delete();
                }
              }
            );
          });
        }
      });
    }
  })
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
    res.json({ message: 'lecture successfully deleted: ' + lecture });
  });
};

exports.enroll = (req, res) => {
  Lecture.findOneAndUpdate({_id: req.params.lectureId}, {$set: {availableSpots: maxEnrollments - enrollments}},
    (err, lecture) => {
      if (err)
        res.send(err);
      res.json(lecture);
    }
  );
};