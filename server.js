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
  app.listen(process.env.APP_PORT, () => {
    console.log(`app listening on port ${process.env.APP_PORT}`);
  });
});


