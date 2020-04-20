'use strict';
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected sucsessfully');
  } catch (e) {
    console.error('Connection to db failed', e);
  }
})();

module.exports = mongoose.connection;
