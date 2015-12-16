import {default as React, Component} from 'react';
import {default as fetch} from 'isomorphic-fetch';

import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import {default as MarkerClusterer} from 'react-google-maps/lib/addons/MarkerClusterer';

export default class MarkerClustererExample extends Component {
  state = {
    markers: [],
    zoom: 3,
    lat: 25.0391667,
    lng: 121.525,
  }

  componentDidMount() {
    fetch('https://gist.githubusercontent.com/farrrr/dfda7dd7fccfec5474d3/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json')
      .then(res => res.json())
      .then(data => {
        this.setState({ markers: data.photos });
      });
  }

  handleBoundsChanged() {
    const center = this.refs.map.getCenter();
    const zoom = this.refs.map.getZoom();
    const stateCenter = new google.maps.LatLng(this.state.lat, this.state.lng);

    if (zoom === this.state.zoom && center.equals(stateCenter)) {
      // Notice: Check equality here, or it will fire event infinitely
      return;
    }

    const lat = center.lat();
    const lng = center.lng();
    this.setState({ lat, lng, zoom });
  }

  render() {
    const { markers, zoom, lat, lng } = this.state;

    return (
      <GoogleMapLoader
        containerElement={
          <div
            {...this.props}
            style={{
              height: '100%',
            }}
            />
        }
        googleMapElement={
          <GoogleMap
            ref='map'
            onBoundsChanged={ ::this.handleBoundsChanged }
            defaultZoom={ zoom }
            defaultCenter={ ({ lat, lng }) }>
            <MarkerClusterer
              averageCenter={ true }
              enableRetinaIcons={ true }
              gridSize={ 60 }>
              { markers.map(marker => (
                <Marker
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                  key={ marker.photo_id }>
                  <InfoWindow
                    options={{ disableAutoPan: true }}
                    key={ `${marker.photo_id}_info` }
                    content={ marker.photo_title } />
                </Marker>
              )) }
            </MarkerClusterer>
          </GoogleMap>
        }
        />
    );
  }
}
