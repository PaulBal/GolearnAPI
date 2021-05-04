const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Student = db.students;
const Tutor = db.tutors;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isStudent = (req, res, next) => {
  Student.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200);
    return;
  });
};

isTutor = (req, res, next) => {
  Tutor.findById(req.userId).exec((err, user) => {
    if(err) {
      res.status(500).send({ message: err });
      return;
    }

    res.status(200);
    return;
  })
}

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });
};

const authJwt = {
  verifyToken,
  isStudent,
  isTutor,
  isModerator
};
module.exports = authJwt;
