var express = require('express'); // Express web server framework

var app = express();

// calls the module.exports function from middleware.js
require('./config/middleware.js')(app, express);
require('./config/routes.js')(app);
require('../database/index.js');

// Dynamic port for Heroku deployment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

module.exports = app;
