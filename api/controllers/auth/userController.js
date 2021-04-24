exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.studentBoard = (req, res) => {
    res.status(200).send("Studnet Content.")
  }

  exports.teacherBoard = (req, res) => {
    res.status(200).send("Teacher Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };