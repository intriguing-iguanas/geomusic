var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');

module.exports = (app, express) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '/../../client/dist')));
  app.use(cookieParser());

  // Heroku requires the root route though express offers the route without definition
  // app.get('/', function (req, res) {
  //   res.status(200).sendFile('index.html');
  // })
}
