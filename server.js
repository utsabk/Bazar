'use strict';

require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db/database');
const graphqlSchema = require('./schema/schema');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
  })
);

db.on('connected', () => {
  app.listen(process.env.APP_PORT, () => {
    console.log(`app listening on port ${process.env.APP_PORT}`);
  });
});
