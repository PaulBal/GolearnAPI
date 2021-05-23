'use strict';

const { decode } = require('jsonwebtoken');

var mongoose = require('mongoose'),
  Lecture = mongoose.model('Lecture'),
  Tutor = mongoose.model('Tutor'),
  Student = mongoose.model('Student');

exports.get_lectures = (req, res) => {
  Lecture.find({}, (err, lectures) => {
    if (err)
      res.send(err);
    res.json(lectures);
  });
};

exports.add_a_lecture = (req, res) => {
  var minLectureLength = 15;
  var minLectureLengthInMillis = minLectureLength*1000*60;
  var startTimeInMillis = new Date(req.body.startDate).getTime();
  var endTimeInMillis = new Date(req.body.endDate).getTime();
  let token = req.headers["x-access-token"];

  if(token) {
    let tutorId = decode(token).id;

    var new_lecture = new Lecture({
      ...req.body,
      tutorId: tutorId,
      availableSpots: req.body.maxEnrollments
    });

    Tutor.findById(tutorId, (err, tutor) => {
      if(err || !tutor) {
        res.status(400).send('We couldn\'t find any tutor with the specified id');
        return;
      } else {
        Lecture.find({'tutorId': tutorId, 'startDate': { '$lt': req.body.endDate }, 'endDate': { '$gt': req.body.startDate }}, (err, docs) => {
          if(err) {
            res.status(400).send(err.toString());
            return;
          } else if(docs.length > 0) {
            res.status(400).send('The tutor with id ' + tutorId + ' is not available at the specified time');
            return;
          } else if(endTimeInMillis - startTimeInMillis < minLectureLengthInMillis){
            console.log(new Date(req.body.startDate) + ' ' + new Date(req.body.endDate));
            res.status(400).send('The lecture has to be at least 15 minutes long!');
            return;
          } else {
            new_lecture.save((err, lecture) => {
              if (err) {
                res.status(400).send(err);
                return;
              }
              res.json(lecture);
              Tutor.findByIdAndUpdate(
                tutorId,
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
  }
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
  let token = req.headers["x-access-token"];

  if(token) {
    let studentId = decode(token).id;
    
    Lecture.findById(req.params.lectureId).where('availableSpots').gt(0).exec((err, lecture) => {
      if(err) {
        res.status(400).send(err);
        return;
      } else if(!lecture) {
        res.status(400).send("The lecture has no available spots");
        return;
      }

      Lecture.find({'studentsEnrolled': studentId, 'startDate': { '$lt': lecture.endDate }, 'endDate': { '$gt': lecture.startDate }}, (err, lectures) => {
          if(err) {
            res.status(400).send(err.toString());
            return;
          } else if(lectures.length > 0) {
            console.log(lectures);
            res.status(400).send("The student is not available.");
            return;
          }

          Student.findByIdAndUpdate(
            studentId,
            { $push: { lectures: lecture.id } },
            { new: true, useFindAndModify: false },
            (err, student) => {
            if(err) {
              res.status(400).send(err.toString());
              return;
            } else if(!student){
              req.status(400).send('We couldn\'t find any student with the specified id');
            }
            
            //{availableSpots: {$subtract: ["$availableSpots", "$maxEnrollments"]},
            //update enrollments
            let aSpots = lecture.availableSpots - 1;
            lecture.updateOne({availableSpots: aSpots, $addToSet: {studentsEnrolled: student.id}}).exec((err, response) => {
              if(err) {
                res.status(400).send(err.toString());
                return;
              }
  
              res.status(200).send();
              return;
            });
          });
        });
    });
  }
}

exports.unenroll = (req, res) => {
  let token = req.headers["x-access-token"];

  if(token) {
    let studentId = decode(token).id;

    Student.findByIdAndUpdate(
      studentId,
      { $pull: { lectures: req.params.lectureId }},
      { new: true, useFindAndModify: false },
      (err, student) => {
      if(err) {
        res.status(400).send(err.toString());
        return;
      }

      Lecture.findByIdAndUpdate(
        req.params.lectureId, 
        { $pull: { studentsEnrolled: studentId } },
        { new: true, useFindAndModify: false },
        (err, lecture) => {
          if(err) {
            res.status(400).send(err.toString());
            return;
          }

          let aSpots = lecture.availableSpots + 1;
          lecture.updateOne({ availableSpots: aSpots }).exec(() => res.status(200).send());
      });
    })
  }
}
