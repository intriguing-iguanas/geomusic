import React from 'react';

const PlaylistItem = (props) => (
      <div className="row row-bottom-padded-sm">
        <div className="col-md-12 col-sm-12 col-xxs-12">
          <div className="fh5co-project-item image-popup to-animate" onClick={function(){ props.getCurrentLocation(props.item)}} >
            <div className="fh5co-text">
              <h2 style={{color: 'grey'}}>
              { props.item.name }
              </h2>
            </div>
          </div>
        </div>
      </div>
)

export default PlaylistItem;
