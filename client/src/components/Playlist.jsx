import React from 'react';
import PlaylistItem from './PlaylistItem.jsx';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: []
    }
  }

  componentDidMount () {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/getplaylists'
    })
    .done(function(data) {
      context.setState({
        playlists: data
      })
    })
  }

  render() {
  // this is some dummy data to show playlist before real data comes through

    return (
    <div>
      <h2 id="fh5co-testimonials"> Select Playlist </h2>
      <div>
      { this.state.playlists.map(item => <PlaylistItem item={item} songSelected={this.props.songSelected} />)}
      </div>
    </div>
  )}
}

export default Playlist;
