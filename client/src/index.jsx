import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Add from './components/Add.jsx';
import Login from './components/Login.jsx';
import Map from './components/Map.jsx';
import Play from './components/Play.jsx';
import Playlist from './components/Playlist.jsx';
import Input from './components/Input.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // loggedIn: true,
      showPlaylist: false,
      radioChecked: false,
      playlistSelected: null,
      location: [],
      currentPlaylist: null,
      showInput: false,
      username: ''
    }
    this.addBtn = this.addBtn.bind(this);
    this.playPlaylist = this.playPlaylist.bind(this);
    this.addtoDB = this.addtoDB.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    this.submitBtn = this.submitBtn.bind(this);
  }

  addBtn() {

    // this.setState({
    //   showPlaylist: true
    // })
    this.setState({
      showInput: true
    })
  }


  submitBtn(username) {
    this.setState({
      showInput: false,
      showPlaylist: true,
      username: username
    })
  }


  playPlaylist(lng, lat) {

    $.ajax({
      method: 'GET',
      url: '/sendClosestPlaylist' + '?' + JSON.stringify(lng) + '=' + JSON.stringify(lat)
    })
    .done(function(data) {
    // redirects client to playlistURL
   // console.log('data', Object.keys(data), data['playlistUrl'])

      //if (!data === 'none') {
        window.location.assign(data['playlistUrl'])
      //};
    })

  }

  componentDidMount () { 
  
  // set this.state.location  
  var _this = this;
  _this.getCurrentLocation(4);
    
  //fire retrievelocalplaylist function and set currentplaylist tag
  var lng = -122.407087;
  var lat = 37.783696;

   setInterval(function(){

    if (_this.state.location.length > 0) {
      lng = _this.state.location[0];
      lat = _this.state.location[1];
    };
    $.ajax({
      method: 'GET',
      url: '/sendClosestPlaylist' + '?' + JSON.stringify(lng) + '=' + JSON.stringify(lat)
    })
      .done(function(data) {
      // redirects client to playlistURL
      if (typeof data === 'string') {
        _this.setState({
          currentPlaylist: 'No Playlists within 1 mile'
        })     
      } else {
        _this.setState({
          currentPlaylist: data.playlistName
        })     
      } 
    })
  }, 1000)
}


  addtoDB(playlist) {
    var context = this;
    $.ajax({
      url: '/newpin',
      type: 'POST',
      data: {
        location: { type: 'Point', coordinates: [context.state.location[0], context.state.location[1]] },
        playlistUrl: playlist.external_urls.spotify,
        playlistName: playlist.name
      }
    })
  }

// get user's current location & call addtoDB
  getCurrentLocation(playlist) {
    var context = this;
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    if (playlist === undefined) {
      context.playPlaylist(context.state.location[0], context.state.location[1])
    }

    function success(pos) {
      var crd = pos.coords;
      context.setState({
        location: [crd.longitude, crd.latitude]
      }, function() {
        if (playlist && !typeof playlist === 'number') {
            context.addtoDB(playlist)      
        }  
      })
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    window.navigator.geolocation.getCurrentPosition(success, error, options);
    
    if (playlist && typeof playlist === 'object') {
      context.setState({
      showPlaylist: false,
      showInput: false
      })
      window.location.reload();
    }
  }


  render () {
    var display = null;

    // if (!this.state.loggedIn) {
    //   display = <Login />
    // } else
    if (this.state.showInput) {
      display =  <div>
                    <Input submitBtn={this.submitBtn} />
                </div>
    } else if (this.state.showPlaylist) {
      display = <div>
                  <Playlist getCurrentLocation={this.getCurrentLocation} addtoDB={this.addtoDB} username={this.state.username}/>
                </div>
    } else {
      display = <div>
                  <Map />
                  <br></br>
                    <div className="btn-group" role="group">
                      <Add addBtn={this.addBtn}/>
                      <Play playPlaylist={this.playPlaylist} getCurrentLocation={this.getCurrentLocation}/>
                    </div>
                    <h2>{this.state.currentPlaylist}</h2>
                </div>
    }
    return (<div>{ display }</div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
