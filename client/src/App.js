import React, { Component } from 'react';
import {default as FaSpinner} from "react-icons/lib/fa/spinner";
import axios from 'axios';

import withScriptjs from "react-google-maps/lib/async/withScriptjs";

import './App.css';
import _ from 'bootstrap/dist/css/bootstrap.css';
import { withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from "react-google-maps";
import geolib from 'geolib';
import {Col, Button} from 'react-bootstrap';

import User from './User.jsx';
import TripOverlayView from './TripOverlayView.jsx';
import SearchForm from './SearchForm.jsx';

// Wrap all `react-google-maps` components with `withGoogleMap` HOC
// and name it GettingStartedGoogleMap
const AsyncGettingStartedExampleGoogleMap = withScriptjs(
  withGoogleMap(
    props => (
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={5}
      defaultCenter={props.defaultCenter}
      onClick={props.onMapClick}
    >

      {console.log(props)}
      {props.markers.map(marker => (
        <Marker
          {...marker}
          onClick={() => props.onMarkerClick(marker)}
        >

        {marker.showInfo && (
          <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div>{marker.name}</div>
          </InfoWindow>
        )}
      </Marker>
      ))}
      {props.polylines.map(polyline => (
        <Polyline
          {...polyline}
          onClick={() => props.onPolylineClicked(polyline)}
        />
    ))}

    { props.overlayView && (
      <TripOverlayView
        {...props.overlayView}
      />
    )}

    </GoogleMap>
  )
));

class App extends Component {
  static defaultProps = {
      center: {lat: 59.938043, lng: 30.337157},
      zoom: 6,
      greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  };

  constructor(props) {
    super(props)

    this._createData()
    this.state = {
      data: [],
      markers: [{
        location: {
          latitude: 52.52000659999999,
          longitude: 13.404953999999975
        },
        name: "Berlin",
        showInfo: false
      }],
      lines: []
    }
  }

  render() {
    var defaultCenter = this.calculateDefaultCenter()
    var overlayView = this.getOverlayView()

    const facebookLoginStyle = {
      width: "auto",
      height: 30,
      marginTop: -75,
      color: "white",
      border: 0,
      backgroundColor: "#39579b"
    }

    const headerStyle = {
      marginTop: -25
    }

    return (
      <div className="App">
      <div className="App-header">
        <Col xs={6} style={headerStyle}><h2>Buddyflights</h2></Col>
        <Col xs={6} xsOffset={6}>
          <Button style={facebookLoginStyle}>Connect with Facebook</Button>
        </Col>
      </div>
      <div className="SearchForm">
        <SearchForm onSearchFinished={this.onSearchFinished.bind(this)}/>
      </div>
      <div className="map">
        <AsyncGettingStartedExampleGoogleMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp"
          loadingElement={
            <div style={{ height: `100%` }}>
              <FaSpinner
                style={{
                  display: `block`,
                  width: `80px`,
                  height: `80px`,
                  margin: `150px auto`,
                  animation: `fa-spin 2s infinite linear`,
                }}
              />
            </div>
          }
          containerElement={
            <div style={{ height: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
          onMapLoad={_.noop}
          onMapClick={_.noop}
          onMarkerClose={this.onMarkerClose.bind(this)}
          onMarkerClick={this.onMarkerClick.bind(this)}
          onPolylineClicked={this.onPolylineClicked.bind(this)}
          defaultCenter={defaultCenter}
          overlayView={overlayView}
          markers={this.state.markers.map(function (marker, i){
            return {position: {
                      lat: marker.location.latitude,
                      lng: marker.location.longitude},
                    showInfo: marker.showInfo,
                    name: marker.name,
                    key: i}
          })}
          polylines={this.state.lines.map(function (line, i){
            var points = [
              line.tripToFriend.start,
              line.tripToFriend.destination,
              line.tripToDestination.destination
            ]
            var path = points.map(function (point) {
              return {
                lat: point.location.latitude,
                lng: point.location.longitude
              }
            })
            var opacity = 0.5
            if (line.isSelected) {
              opacity = 1.0
            }

            return {path: path, key: i, options: {
                strokeOpacity: opacity,
                strokeColor: '#4286f4',
                strokeWeight: 5
              }
            }
          })}
          onMarkerRightClick={_.noop}
      />
      </div>
      </div>
    );
  }

  _createData() {
    axios.post("http://localhost:8000/1/login", {
      facebookId: 1,
      airport: "CGN-sky",
      city: "Cologne, Germany",
      friends: [2, 3, 4],
      firstName: "Daniel",
      lastName: "Taschik",
      profilePicture: "https://scontent-fra3-1.xx.fbcdn.net/v/t1.0-1/c80.0.320.320/p320x320/943615_10151925738794762_1039440791_n.jpg"
    })

    axios.post("http://localhost:8000/1/login", {
      facebookId: 2,
      airport: "STOC-sky",
      city: "Stockholm, Sweden",
      friends: [1, 3, 4],
      firstName: "Erik",
      lastName: "Westrup",
      profilePicture: "https://scontent-fra3-1.xx.fbcdn.net/v/t1.0-1/p320x320/14463069_10153869408475823_7971952732884700903_n.jpg"
    })

    axios.post("http://localhost:8000/1/login", {
      facebookId: 3,
      airport: "AMS-sky",
      city: "Amsterdam, Netherlands",
      friends: [2, 1, 4],
      firstName: "Anne",
      lastName: "Verheul",
      profilePicture: "https://scontent-fra3-1.xx.fbcdn.net/v/t1.0-1/c0.53.320.320/p320x320/13626424_10208580716887832_143069116248888140_n.jpg"
    })

    axios.post("http://localhost:8000/1/login", {
      facebookId: 4,
      airport: "BERL-sky",
      city: "Berlin, Germany",
      friends: [2, 3, 1],
      firstName: "Tim",
      lastName: "Specht",
      profilePicture: "https://scontent-fra3-1.xx.fbcdn.net/v/t1.0-1/c0.0.320.320/p320x320/10676326_10204902627596154_9111178845808767020_n.jpg"
    })
  }

  onSearchFinished (resp) {
    this.setState({data: resp.data.filter(function(n){ return n != undefined }) })
    // Build up the markers
    var markers = []
    var lines = []
    var isInMarkers = function (element) {
      for (var marker in markers) {
        if (marker.name === element.name) {
          return true
        }
      }
      return false
    }
    this.state.data.forEach(function (data) {
      var inbound = data.tripToFriend
      var outbound = data.tripToDestination

      inbound.start.showInfo = false
      inbound.destination.showInfo = false
      outbound.destination.showInfo = false

      data.isSelected = false

      if (!isInMarkers(inbound.start)) { markers.push(inbound.start)}
      if (!isInMarkers(inbound.destination)) { markers.push(inbound.destination)}
      if (!isInMarkers(outbound.destination)) { markers.push(outbound.destination)}

      lines.push(data)
    })
    this.setState({markers: markers, lines: lines})
  }

  calculateDefaultCenter () {
     var center = geolib.getCenter(this.state.markers.map(function (element) {
       return element.location
     }))
     if (!center) {
       return {lat: 55.61802360000001, lng: 12.650762799999939}
     } else {
       return {lat: parseFloat(center.latitude), lng: parseFloat(center.longitude)}
     }
  }

  onMarkerClose(targetMarker) {
    this._toggleMarker(targetMarker)
    this.forceUpdate()
  }

  _toggleMarker (marker) {
    this.state.markers.forEach(function (element) {
      if (element.name == marker.name) {
        element.showInfo = !element.showInfo
      }
    })
  }

  // Toggle to 'true' to show InfoWindow and re-renders component
  onMarkerClick(targetMarker) {
    this._toggleMarker(targetMarker)
    this.forceUpdate()
  }

  onPolylineClicked(polyline) {
    var line = this.state.lines[polyline.key]
    line.isSelected = true
    this.state.lines.forEach(function (element, index) {
      if (index != polyline.key) {
        element.isSelected = false
      }
    })
    this.forceUpdate()
  }

  getOverlayView () {
    // Check if there is anything selected in the data source
    var returnData = undefined
    this.state.lines.forEach(function(line) {
      if (line.isSelected) {
        returnData = line
    }})
    return returnData
  }
}

export default App;
