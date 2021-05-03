const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./auth/userModel");
db.role = require("./auth/roleModel");
db.students = require("./studentModel");
db.tutors = require("./tutorModel");

db.ROLES = ["user", "student", "tutor", "admin", "moderator"];

module.exports = db;
