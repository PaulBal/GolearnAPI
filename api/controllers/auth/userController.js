exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.studentBoard = (req, res) => {
  res.status(200).send("Student Content.")
}

exports.teacherBoard = (req, res) => {
  res.status(200).send("Tutor Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};