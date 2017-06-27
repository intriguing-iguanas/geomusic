/// ===================== BOILER PLATE DEPENDENCIES ===================

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/../client/dist'));

/// ===================== BOILER PLATE DB ROUTE =========================

var pins = require('../database');

app.get('/pins', function (req, res) {
  pins.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

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

// module.exports = app;

/// =========================== SPOTIFY DEPENDENCIES ======================

var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var spotifyHelper = require('./spotifyHelper.js');

app.get('/spotify', function(req, res) {
  var user_id = process.env.CLIENT_ID || 'wizzler'; // Your client id
  // for development only: not for deployment
  var secret = require('../secret.js');
  var access_token = process.env.ACCESS_TOKEN || secret.TEMP_TOKEN;
  spotifyHelper.getAllPlayList(user_id, access_token);
  res.status(200).end();
})

/// =========================== SPOTIFY app helper =============================
/*
 * This is a node.js script that performs the Authorization Code oAuth2
 * flow to authenticate against the Spotify Accounts.
 * to use this file correctly, generate secret.js file in root, and put the
 * following string in your file
 *
 * module.exports.CLIENT_ID='your client ID';
 * module.exports.CLIENT_SECRET='your client secret';
 * module.exports.REDIRECT_URI=
 * 'http://localhost:3000/callback/'
 * https://geo-music.herokuapp.com/
 * and make sure you add the http://localhost:3000/callback/ to your white list
 * in spotify
*/
//  =========================== API secrets  ===========================

// FIXME: refactor to dynamically change according to local/testing/staging/production
// for development only: not for deployment
var secret = require('../secret.js');

// setup the url for the Heroku or for the development
var env = process.env.NODE_ENV || 'local';
var redirect_uri = env === 'local' ? 'http://localhost:3000/callback/' : 'https://geo-music-staging.herokuapp.com/callback/';

// choose between env variables for Heroku or dev env
var client_id = process.env.CLIENT_ID || secret.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET || secret.CLIENT_SECRET; // Your secret

//  ========================================================================

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
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
          console.log(body);
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