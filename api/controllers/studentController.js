'use strict';

const { decode } = require('jsonwebtoken');

var mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  Lecture = mongoose.model('Lecture');

exports.list_all_students = (req, res) => {
  Student.find({}, (err, student) => {
    if (err)
      res.send(err);
    res.json(student);
  });
};

exports.get_enrollments = (req, res) => {
  let token = req.headers["x-access-token"];
  let studentId = decode(token).id;
  
  Student.findById(studentId, (err, student) => {
    if(err) {
      res.status(400).send(err);
      return;
    } else if(!student) {
      res.status(400).send("The student with the specified id doesn not exhist");
      return;
    }

    Lecture.find({_id: student.lectures}, (err, enrollments) => {
      if(err) {
        console.log(student.enrollments);
        res.status(400).send('Couldn\'t find the enrollments: ' + err);
        return;
      }

      res.json(enrollments);
    });
  })
}

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
  Student.findOneAndUpdate({_id: req.params.studentId}, req.body, {new: true}, (err, student) => {
    if (err)
      res.send(err);
    res.json(student);
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
