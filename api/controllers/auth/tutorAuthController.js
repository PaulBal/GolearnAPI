const config = require("../../config/auth.config");
const db = require("../../models");
const Tutor = db.tutors;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.tutor_signup = (req, res) => {
    const tutor = new Tutor({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });
  
    Tutor.findOne({ username: req.body.username }).exec((err, tutorFound) => {
  
      if(err) {
        res.status(500).send({ message: err });
      }
  
      if(tutorFound) {
        res.status(400).send("Username already in use!");
        return;
      }
  
      tutor.save((err, tutor) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        res.send({ message: "tutor was registered successfully!" });
      });
    })
  };
  
  exports.tutor_signin = (req, res) => {
    Tutor.findOne({
      username: req.body.username
    }).exec((err, tutor) => {
  
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (!tutor) {
        return res.status(404).send({ message: "Tutor Not found." });
      }
  
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        tutor.password
      );
  
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
  
        var token = jwt.sign({ id: tutor.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
  
        res.status(200).send({
          id: tutor._id,
          firstName: tutor.firstName,
          lastName: tutor.lastName,
          email: tutor.email,
          accessToken: token
        });
      });
  };