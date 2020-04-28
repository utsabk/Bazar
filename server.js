'use strict';

require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphqlUploadExpress } = require('graphql-upload');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db/database');
const graphqlSchema = require('./schema/schema');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/modules', express.static('node_modules'));

app.use(
  '/graphql',
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  (req, res) => {
    graphqlHTTP({
      schema: graphqlSchema,
      graphiql: true,
      context: { req, res },
    })(req, res);
  }
);
db.on('connected', () => {
  http.listen(process.env.APP_PORT, () => {
    console.log(`app listening on port ${process.env.APP_PORT}`);
  });
});

// Socket

let connectedSockets = [];

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  connectedSockets.push(socket.id);
  io.emit('newConnection', {
    myID: socket.id,
    connections: connectedSockets,
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);
    connectedSockets = connectedSockets.filter((value) => value != socket.id);
    io.emit('connectionLost', {
      lostID: socket.id,
      connections: connectedSockets,
    });
  });

  socket.on('send message', (user, msg) => {
    console.log('message: ', msg);
    console.log('user', user);
    io.emit('new message', {
      message: msg,
      username: user,
      socketID: socket.id,
    });
  });
});
