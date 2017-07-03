import React from 'react';

const PlaylistItem = (props) => (
      <div className="row row-bottom-padded-sm">
        <div className="col-md-4 col-sm-6 col-xxs-12">
          <a href="#" className="fh5co-project-item image-popup to-animate">
            <div className="fh5co-text">
              <h2 style={{color: 'grey'}}>
              { props.item.name }
              <button className="btn btn-lg pull-right" type="button" onClick={function(){ props.getCurrentLocation(props.item)}} >Select</button>
              </h2>
            </div>
          </a>
        </div>
      </div>
)

export default PlaylistItem;
