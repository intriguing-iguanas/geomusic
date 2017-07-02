var db = require('../../database');

module.exports = function (req, res) {

  var params = req.url.slice(21).split('=');
  var lng = JSON.parse(params[0]);
  var lat = JSON.parse(params[1]);

  db.getPinsWithinRadius(lng, lat, function(err, data){
    var closestPin = [];

    for (var k = 0; k < data.length; k++ ) {
      // find nearest pin
      var a = Math.abs(lng - data[k].location.coordinates[0]);
      var b = Math.abs(lat - data[k].location.coordinates[1]);
      var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
      closestPin.push(c);
    }
      var min = Math.min.apply(Math, closestPin);
      var index = closestPin.indexOf(min);
      // send playlist back to client
      if (index === -1){
        res.send('401');
      } else {
        res.send(data[index]);
      };
  })
}