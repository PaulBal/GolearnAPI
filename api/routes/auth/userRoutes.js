const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/auth/userController");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/all", controller.allAccess);

  app.get("/api/user", [authJwt.verifyToken], controller.userBoard);

  app.get("/api/student",
    [authJwt.verifyToken, authJwt.isStudent],
    controller.studentBoard
  );

  app.get("/api/teacher",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.teacherBoard
  );

  app.get(
    "/api/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
};
