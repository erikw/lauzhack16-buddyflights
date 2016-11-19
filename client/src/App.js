import React, { Component } from 'react';
import logo from './logo.svg';

import './App.css';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import GoogleMap from 'google-map-react';

import User from './User.jsx';
import SearchForm from './SearchForm.jsx';

class App extends Component {
  static defaultProps = {
      center: {lat: 59.938043, lng: 30.337157},
      zoom: 9,
      greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
    };

  render() {
    return (
      <div className="App">
      <div className="App-header">
      </div>
      <div className="SearchForm">
        <SearchForm />
      </div>
      <div className="map">
        <GoogleMap
          bootstrapURLKeys={{key: "AIzaSyBkUTdFNK1gaHC_qjI9O-CITFNUcDTuplU"}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}>
          <User lat={59.955413} lng={30.337844} text={'Aasdasd'} /* Kreyser Avrora */ />
          <User {...this.props.greatPlaceCoords} text={'Basdasd'} /* road circle */ />
        </GoogleMap>
      </div>
      </div>
    );
  }
}

export default App;
