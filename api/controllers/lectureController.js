'use strict';

const { db } = require('../models/lectureModel');

var mongoose = require('mongoose'),
  Lecture = mongoose.model('Lecture'),
  Tutor = mongoose.model('Tutor'),
  Student = mongoose.model('Student');

exports.get_lectures = (req, res) => {
  Lecture.find({}, (err, lecture) => {
    if (err)
      res.send(err);
    res.json(lecture);
  });
};

exports.add_a_lecture = async (req, res) => {
  var new_lecture = new Lecture({
    ...req.body,
    availableSpots: req.body.maxEnrollments
  });

  Tutor.findById(req.body.tutorId, (err, tutor) => {
    if(err || !tutor) {
      res.status(400).send('We couldn\'t find any tutor with the specified id');
      return;
    } else {
      Lecture.find({'tutorId': tutor.id, 'startDate': { '$lt': req.body.endDate }, 'endDate': { '$gt': req.body.startDate }}, (err, docs) => {
        if(docs.length > 0) {
          res.status(400).send('The tutor with id ' + req.body.tutorId + ' is not available at the specified time');
          return;
        } else if(err) {
          res.status(400).send(err);
          return;
        } else {
          new_lecture.save((err, lecture) => {
            if (err) {
              res.status(400).send(err);
              return;
            }
            res.json(lecture);
            Tutor.findByIdAndUpdate(
              tutor.id,
              { $push: { lectures: new_lecture.id } },
              { new: true, useFindAndModify: false },
              (err, res) => {
                if(err) {
                  res.status(400).send(err);
                  lecture.delete();
                  return;
                }
              }
            );
          });
        }
      });
    }
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
    res.json({ message: 'lecture successfully deleted: ' + lecture });
  });
};

exports.enroll = (req, res) => {

  Lecture.findById(req.params.lectureId).where("availableSpots").gt(0).exec((err, lecture) => {
    if(err) {
      res.status(400).send(err);
      return;
    } else if(!lecture) {
      res.status(400).send("The lecture has no available spots");
      return;
    }

    Student.find({_id: req.body.studentId, lectures: lecture.id}, (err, students) => {
      if(err) {
        res.status(400).send(err);
        return;
      } else if(students.length > 0) {
        res.status(400).send("The student has already signed up for this lecture.");
        return;
      }

      Student.findByIdAndUpdate(
        req.body.studentId, 
        { $push: { lectures: lecture.id } },
        { new: true, useFindAndModify: false },
        (err, student) => {
        if(err) {
          res.status(400).send('We couldn\'t find any student with the specified id');
          return;
        }
        
        //{availableSpots: {$subtract: ["$availableSpots", "$maxEnrollments"]},
        //update enrollments
        let aSpots = lecture.availableSpots - 1;
        lecture.updateOne({availableSpots: aSpots, $addToSet: {studentsEnrolled: student.id}}).exec((err, response) => {
          if(err) {
            res.status(400).send(err);
            return;
          }

          res.status(200).send();
          return;
        });
      });
    });
  });
}
