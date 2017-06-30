var mongoose = require('mongoose');

// for development only: not for deployment
// comment out before pull request:
// var secret = require('../secret.js');

// choose between env variables for Heroku or dev env
var mongodb_user = process.env.MONGODB_USER || secret.MONGODB_USER;
var mongodb_password = process.env.MONGODB_PASSWORD || secret.MONGODB_PASSWORD;

mongoose.connect(`mongodb://${mongodb_user}:${mongodb_password}@ds139352.mlab.com:39352/geomusic`);

var db = mongoose.connection;

db.on('error', function() {
  console.log('Mongoose connection error');
});

db.once('open', function() {
  console.log('Mongoose connected successfully');
});

module.exports = db;
