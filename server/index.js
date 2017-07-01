/// ===================== BOILER PLATE DEPENDENCIES ===================

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var bodyParser = require('body-parser');
var db = require('../database');
// var secret = require('../secret.js')// for development only: not for deployment
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client/dist'));

/// ===================== BOILER PLATE DB ROUTE =========================

var Pin = require('../database').pin;

app.get('/pins', function (req, res) {
  pins.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

// play button get request for playlist in current location

var db = require('../database');

// req.body has to have current location of a user
app.get('/sendClosestPlaylist', require('./controllers/sendClosestPlaylist'));

// add new pin to DB
app.post('/newpin', require('./controllers/newpin'))

/// =========================== SERVER RUN =============================

// Dynamic port for Heroku deployment
var port = process.env.PORT || 3000;

// Heroku requires the root route though express offers the route without definition
app.get('/', function (req, res) {
  res.status(200).sendFile('index.html');
})

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

/// =========================== SPOTIFY DEPENDENCIES ======================

// "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

/// =========================== SPOTIFY app helper =============================

// setup the url for the Heroku or for the development
var env = process.env.NODE_ENV || 'local';
var redirect_uri = env === 'local' ? 'http://localhost:3000/callback/' : 'https://geo-music-staging.herokuapp.com/callback/';

// choose between env variables for Heroku or dev env
var user_id = process.env.CLIENT_ID || 'greenfield8080';
var client_id = process.env.CLIENT_ID || secret.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET || secret.CLIENT_SECRET;

//  ========================================================================

  // use the random string to set state of the auth
  var stateKey = 'spotify_auth_state';

// use the client folder with the cookie parser for cookies needed
app.use(express.static(__dirname + '/client/dist'))
   .use(cookieParser());

// login route
app.get('/login', require('./controllers/login'));

// login route redirects to this callback route. this route genetates tokens
app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  // checks with state to see if the browser that pressed the login button is accessing
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    
    // if state matched, enter the token acquire process

    // clear cookie so that later user of the browser will have to get another state
    res.clearCookie(stateKey);

    // get token with client id and secret
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log("these are the tokens", access_token, refresh_token);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// token refresh. necessary when having another request
app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      console.log('access_token', access_token);
      res.send({
        'access_token': access_token
      });
    }
  });
});


/// =========================== SPOTIFY credential helper =============================

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/jmperezperez',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      // console.log(body);
    });
  }
});

// =================== SPOTIFY Data Retrieval =========================
// GET https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks

app.get('/getAccessToken', require('./controllers/getAccessToken.js'))

var TOKEN = process.env.TEMP_TOKEN || 'BQAyzDFCIgqYWimLvlfIZBlgeoJEK0ZL5ZJskkOfwfW9QNQY4oFgjzd5niBN-kbk9SX83zRPpRYE0V4UWJkTwWCjRQ-zepmacj4Z0G4fCk1Iis1N6lj6xsXGdd1kRTgLyUxv3gOThLblAivmUbt7k299543hOq4&refresh_token=AQCNJlh52_vDXBEznReCsiwdvH6nVo_5GyfpdbSyf1iAjiaxPF1Ka8_z3S4ydnlfdKJnDZwiFQ8_O8NBGbSS6A2jwHsZq94OpeI3cMcKIospEZJvjfQAqpUhF7xReiFIBj0'
// var TOKEN = getAccessToken().then((data) => data).catch((error) => console.log(error));
var REFRESH_TOKEN = '';


app.get('/getplaylists', function(req, res) {
  const options = {
    url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
    method: 'GET',
    headers: {
      // Authorization: 'Bearer ' + TOKEN + '&refresh_token=' + REFRESH_TOKEN
      Authorization: 'Bearer ' + TOKEN
    }
  };

  request(options, function(err, response, body) {
    if (err) {
      console.error(err);
    } else {
      var parsedBody = JSON.parse(body)
      console.log('parsedBody.items', parsedBody);
      res.send(parsedBody.items)
    }
  });
})

app.post('/spotify', function(req, res) {

  var user_id = process.env.CLIENT_ID || 'greenfield8080'; // Your client id
  var access_token = process.env.ACCESS_TOKEN || secret.TOKEN;

  getAllPlayList(user_id, access_token)
  .then((response) => {

    console.log(response);
    res.status(200).send('OK');
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('NOT OK');
  });
})
