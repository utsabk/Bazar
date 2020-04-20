'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./db/database');

const app = express();
app.use(cors);

db.on('connected', () => {
    app.listen(process.env.APP_PORT, ()=>{
        console.log(`app listening on port${process.env.APP_PORT}`)
    });
});


