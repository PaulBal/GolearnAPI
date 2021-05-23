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
                    () => console.log('Connected to Golearn database'),
                    err => console.log(err)
                  );


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//importing routes
var studentRoutes = require('./api/routes/studentRoutes');
var tutorRoutes = require('./api/routes/tutorRoutes');
var authRoutes = require('./api/routes/auth/authRoutes');
var userRoutes = require('./api/routes/auth/userRoutes');
var lectureRoutes = require('./api/routes/lectureRoutes');

//register the routes
studentRoutes(app);
tutorRoutes(app);
authRoutes(app);
userRoutes(app);
lectureRoutes(app);

server = require('http').Server(app);
io = require('socket.io')(server, {
  cors: 'http://localhost:4200'
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log('user joined room ' + roomId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      console.log('user diconnected');
      socket.broadcast.to(roomId).emit('user-disconnected', userId);
    });
  });
});

app.listen(port);
server.listen(3000);

console.log('Golearn API server started on port ' + port);