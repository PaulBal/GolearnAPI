const config = require("../../config/auth.config");
const db = require("../../models");
const Student = db.students;
const Tutor = db.tutors;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.student_signup = (req, res) => {
  const student = new Student({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  Student.findOne({ username: req.body.username }).exec((err, studentFound) => {

    if(err) {
      res.status(500).send({ message: err });
    }

    if(studentFound) {
      res.status(400).send("Username already in use!");
      return;
    }

    student.save((err, student) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      res.send({ message: "Student was registered successfully!" });
    });
  })
};

exports.student_signin = (req, res) => {
  Student.findOne({
    username: req.body.username
  }).exec((err, student) => {

    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!student) {
      return res.status(404).send({ message: "Student Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      student.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

      var token = jwt.sign({ id: student.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        accessToken: token
      });
    });
};
