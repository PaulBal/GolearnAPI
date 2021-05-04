const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.students = require("./studentModel");
db.tutors = require("./tutorModel");

module.exports = db;
