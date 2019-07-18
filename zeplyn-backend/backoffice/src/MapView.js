import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {}
    };
  }
  onMarkerClick = (props, marker) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onWindowClosed = () => {
    this.setState({
      showingInfoWindow: false
    });
  }

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  render() {
    return (
      <div
          style={{
            width: '40%',
            height: '350px',
            position: 'relative',
          }}
      >
        <h3>Location</h3>
        <Map
            google={this.props.google} 
            zoom={14}
            style={{
              width: '100%',
              height: '300px',
            }}
            initialCenter={{
              lat: this.props.record.location.coordinates[0],
              lng: this.props.record.location.coordinates[1],
            }}
        >
          <Marker 
              onClick={this.onMarkerClick}
              name="Current location"
          />
          <InfoWindow
              onClose={this.onWindowClosed}
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
          >
            <div>
              <h1>{this.props.record.name}</h1>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyBnrw9kCAw02vx5ElmZCrrPkgab8IOHLxM')
})(MapContainer);
