var Q = require('q');
var SpotifyWebApi = require('spotify-web-api-js');

var getAllPlayList = (user_id, access_token) => {
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(access_token);
  spotifyApi.setPromiseImplementation(Q);
};

module.exports.getAllPlayList = getAllPlayList;





// // set it in the wrapper
// var spotifyApi = new SpotifyWebApi();
// spotifyApi.setAccessToken('<here_your_access_token>');
// spotifyApi.getUserPlaylists('jmperezperez')
//   .then(function(data) {
//     console.log('User playlists', data);
//   }, function(err) {
//     console.error(err);
//   });

// spotifyApi.getPlaylist('jmperezperez', '4vHIKV7j4QcZwgzGQcZg1x')
//   .then(function(data) {
//     console.log('User playlist', data);
//   }, function(err) {
//     console.error(err);
//   });

// should get user's playlists
//   var api = new SpotifyWebApi();
//   api.setAccessToken('<example_access_token>');
//   api.getUserPlaylists('a_user', callback);
//   that.requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixtures.user_playlists));
//   expect(callback.calledWith(null, fixtures.user_playlists)).toBeTruthy();
//   expect(that.requests.length).toBe(1);
//   expect(that.requests[0].url).toBe('https://api.spotify.com/v1/users/a_user/playlists');
// });

// it("should get current user's playlists", function() {
//     var callback = sinon.spy();
//     var api = new SpotifyWebApi();
//     api.setAccessToken('<example_access_token>');
//     api.getUserPlaylists(callback);
//     that.requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixtures.user_playlists));
//     expect(callback.calledWith(null, fixtures.user_playlists)).toBeTruthy();
//     expect(that.requests.length).toBe(1);
//     expect(that.requests[0].url).toBe('https://api.spotify.com/v1/me/playlists');
//   });

//   it("should get current user's playlists with options", function() {
//     var callback = sinon.spy();
//     var api = new SpotifyWebApi();
//     api.setAccessToken('<example_access_token>');
//     api.getUserPlaylists({ limit: 10, offset: 50 }, callback);
//     that.requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixtures.user_playlists));
//     expect(callback.calledWith(null, fixtures.user_playlists)).toBeTruthy();
//     expect(that.requests.length).toBe(1);
//     expect(that.requests[0].url).toBe('https://api.spotify.com/v1/me/playlists?limit=10&offset=50');
//   });


// // get Elvis' albums, passing a callback. When a callback is passed, no Promise is returned
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
//   if (err) console.error(err);
//   else console.log('Artist albums', data);
// });

// // get Elvis' albums, using Promises through Promise, Q or when
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
//   .then(function(data) {
//     console.log('Artist albums', data);
//   }, function(err) {
//     console.error(err);
//   });


// return new Promise((resolve, reject) => {

//   var playlistUrl = `https://api.spotify.com/v1/${user_id}//playlists`;
//   var TEMP_TOKEN = process.env.TEMP_TOKEN || secret.TEMP_TOKEN;

//   $.ajax({
//     url: playlistUrl,
//     type: 'GET',
//     dataType: 'json',
//     contentType: 'application/json',
//     Authorization: 'Bearer' + TEMP_TOKEN,
//     processData: false,
//     success: (data) => {
//       alert(JSON.stringify(data));
//     },
//     error: function(){
//       alert("Cannot get data");
//     }
//   });

// })

/// =========================== SPOTIFY Playlist GET request =============================
// GET https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks

// User 1 story
// use bluebird promise to get one playlist designated
// use bluebird promise to get all playlist for a person
// display list of playlists of one particular person
// have click event work for play lists

// User 2 story
// post event to add a selected public playlist to my own

// backlog story
// have the add function possible to set expiration
// have the add function designate particular user ID