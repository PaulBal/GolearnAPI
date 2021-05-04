const { verifySignUp } = require("../../middlewares");
const studentAuthController = require("../../controllers/auth/studentAuthController");
const tutorAuthController = require("../../controllers/auth/tutorAuthController");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/student/signup",
    [
      verifySignUp.checkDuplicateStudent
    ],
    studentAuthController.student_signup
  );

  app.post(
    "/api/auth/tutor/signup",
    verifySignUp.checkDuplicateTutor,
    tutorAuthController.tutor_signup
  );

  app.post("/api/auth/student/signin", studentAuthController.student_signin);
  app.post("/api/auth/tutor/signin", tutorAuthController.tutor_signin);
};
