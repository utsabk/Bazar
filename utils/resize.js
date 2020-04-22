'use strict';
const sharp = require('sharp');

const transformer = (size) => {
  return sharp()
    .resize(size)
    .on('info', (info) => {
      console.log('Image height is ' + info.height);
    });
};

module.exports =  transformer ;
