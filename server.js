'use strict';

require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphqlUploadExpress } = require('graphql-upload');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const db = require('./db/database');
const Chat = require('./models/chat');
const graphqlSchema = require('./schema/schema');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// before routes; otherwise middleware didn't get called
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });

  http.listen(process.env.PORT);
} else {
  http.listen(process.env.HTTP_PORT, () => {
        console.log(`app listening on port ${process.env.HTTP_PORT}`);
      });
}

app.use(cors());
app.use(helmet());
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

// Socket
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.emit('newConnection', socket.id);

  socket.on('new user', (data) => {
    socket.join(data.userID); // Joined a room with userId
  });

  socket.on('send message', (data) => {
    // Send message to client itself
    socket.emit('new message', {
      message: data.message,
      sender: {
        name: data.username,
        id: data.userID,
        dp: data.picture,

      },
    });

    // This sends messages to specific room excludes sender
    // Since the room is created with username messages are sent to
    // all the instances created with same username even though socket id are different
    socket.to(data.productOwner).emit('new message', {
      message: data.message,
      sender: {
        name: data.username,
        id: data.userID,
        dp: data.picture,
      },
    });

    // Save data in the database
    (async () => {
      try {
        let chatMessage = new Chat({
          message: data.message,
          sender: data.userID,
          sendTo: data.productOwner,
        });

        return await chatMessage.save();
      } catch (err) {
        new Error(err.message);
      }
    })();
  });
});
