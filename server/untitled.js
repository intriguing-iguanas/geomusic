var getAccessToken = () => {
  return new Promise((resolve, reject) => {
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
      if (error) reject(error);
      console.log(body);
      resolve(body.access_token);
    })
  })
}


var getAllPlayList = (client_id, access_token) => {

  return new Promise((resolve, reject) => {

    const options = {
      url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
      method: 'GET',
      headers: {
      // Authorization: 'Bearer ' + TOKEN + '&refresh_token=' + REFRESH_TOKEN
      Authorization: 'Bearer ' + TOKEN
      }
    };

    request(options, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        let json = JSON.stringify(body);
        resolve(json);
      }
    });

  })
};