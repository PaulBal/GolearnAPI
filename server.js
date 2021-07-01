var express = require('express'),
  app = express(),
  cors = require('cors'),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Student = require('./api/models/studentModel'),
  Lecture = require('./api/models/lectureModel'),
  dbConfig = require('./api/config/db.config')
  bodyParser = require('body-parser');

app.use(cors());
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@cluster0.ddqrq.mongodb.net/Golearn?retryWrites=true&w=majority`,
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

var peersToCall = [];
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log('user ' + userId + ' joined room ' + roomId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);
    // socket.emit('peers-to-call', peersToCall);
    // peersToCall.push(userId);

    socket.on('disconnect', () => {
      console.log('user diconnected');
      peersToCall = peersToCall.filter(peerId => peerId !== userId);
      socket.disconnect();
      socket.broadcast.to(roomId).emit('user-disconnected', userId);
    });
  });
});

app.listen(port);
server.listen(3000);

console.log('Golearn API server started on port ' + port);