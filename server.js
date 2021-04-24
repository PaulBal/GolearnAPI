var express = require('express'),
  app = express(),
  cors = require('cors'),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Student = require('./api/models/studentModel'),
  Lecture = require('./api/models/lectureModel'),
  bodyParser = require('body-parser');

app.use(cors());
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://Paul:1234@cluster0.ddqrq.mongodb.net/Golearn?retryWrites=true&w=majority',
                  {useUnifiedTopology: true, useNewUrlParser: true}).then(
                    () => console.log('Connected to MongoDB'),
                    err => console.log(err)
                  );


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//importing routes
var studentRoutes = require('./api/routes/studentRoutes');
var teacherRoutes = require('./api/routes/teacherRoutes');
var authRoutes = require('./api/routes/auth/authRoutes');
var userRoutes = require('./api/routes/auth/userRoutes');
var lectureRoutes = require('./api/routes/lectureRoutes');

//register the routes
studentRoutes(app);
teacherRoutes(app);
authRoutes(app);
userRoutes(app);
lectureRoutes(app);

app.listen(port);

console.log('RESTful API server started on: ' + port);