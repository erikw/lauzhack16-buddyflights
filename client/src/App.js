import React, { Component } from 'react';
import {default as FaSpinner} from "react-icons/lib/fa/spinner";

import withScriptjs from "react-google-maps/lib/async/withScriptjs";

import './App.css';
import _ from 'bootstrap/dist/css/bootstrap.css';
import { withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from "react-google-maps";
import geolib from 'geolib';

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
    this.state = {
      1123: {
        isSelected: false,
        inbound: {
          start: {
            name: "Berlin",
            location: {
              latitude: 52.5910076,
              longitude: 13.270907699999952
            },
            showInfo: false
          },
          destination: {
            name: "Amsterdam",
            location: {
              latitude: 52.3076865,
              longitude: 4.767424099999971
            },
            showInfo: false
          },
          friend: {
            id: 1123,
            picture: "http://static.giantbomb.com/uploads/original/1/17172/1419618-unicorn2.jpg",
            name: "Daniel"
          },
          start_time: "2016-11-15 12:11:10",
          arrival_time: "2016-11-14 23:23:10",
          price: 100,
          additional_costs: 24
        },
        outbound: {
          start: {
            name: "Amsterdam",
            location: {
              latitude: 52.3076865,
              longitude: 4.767424099999971
            },
            showInfo: false
          },
          destination: {
            name: "Stockholm",
            location: {
              latitude: 59.6497622,
              longitude: 17.923780699999952
            },
            showInfo: false
          },
          friend: {
            id: 1123,
            picture: "http://static.giantbomb.com/uploads/original/1/17172/1419618-unicorn2.jpg",
            name: "Daniel"
          },
          start_time: "2016-11-15 12:11:10",
          arrival_time: "2016-11-14 23:23:10",
          price: 100,
          additional_costs: 24
        }
      },
      123123: {
        isSelected: false,
        inbound: {
          start: {
            name: "Berlin",
            location: {
              latitude: 52.5910076,
              longitude: 13.270907699999952
            },
            showInfo: false
          },
          destination: {
            name: "Copenhagen",
            location: {
              latitude: 55.61802360000001,
              longitude: 12.650762799999939
            },
            showInfo: false
          },
          friend: {
            id: 123123,
            picture: "http://static.giantbomb.com/uploads/original/1/17172/1419618-unicorn2.jpg",
            name: "Daniel"
          },
          start_time: "2016-11-15 12:11:10",
          arrival_time: "2016-11-14 23:23:10",
          price: 100,
          additional_costs: 24
        },
        outbound: {
          start: {
            name: "Copenhagen",
            location: {
              latitude: 55.61802360000001,
              longitude: 12.650762799999939
            },
            showInfo: false
          },
          destination: {
            name: "Stockholm",
            location: {
              latitude: 59.6497622,
              longitude: 17.923780699999952
            },
            showInfo: false
          },
          friend: {
            id: 123123,
            picture: "http://static.giantbomb.com/uploads/original/1/17172/1419618-unicorn2.jpg",
            name: "Daniel"
          },
          start_time: "2016-11-15 12:11:10",
          arrival_time: "2016-11-14 23:23:10",
          price: 100,
          additional_costs: 24
        }
      }
    }

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
    for (var friendID in this.state) {
      var data = this.state[friendID]
      var inbound = data.inbound
      var outbound = data.outbound

      if (!isInMarkers(inbound.start)) { markers.push(inbound.start)}
      if (!isInMarkers(inbound.destination)) { markers.push(inbound.destination)}
      if (!isInMarkers(outbound.destination)) { markers.push(outbound.destination)}

      lines.push(data)
    }
    this.markers = markers
    this.lines = lines
  }

  render() {
    var defaultCenter = this.calculateDefaultCenter()
    var overlayView = this.getOverlayView()
    console.log(overlayView)

    return (
      <div className="App">
      <div className="App-header">
        Buddyflights
      </div>
      <div className="SearchForm">
        <SearchForm onSearchFinished={this.onSearchFinished}/>
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
          markers={this.markers.map(function (marker, i){
            return {position: {
                      lat: marker.location.latitude,
                      lng: marker.location.longitude},
                    showInfo: marker.showInfo,
                    name: marker.name,
                    key: i}
          })}
          polylines={this.lines.map(function (line, i){
            var points = [
              line.inbound.start,
              line.inbound.destination,
              line.outbound.destination
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

  onSearchFinished (data) {
    console.log(data)
  }

  calculateDefaultCenter () {
     var center = geolib.getCenter(this.markers.map(function (element) {
       return element.location
     }))
     return {lat: parseFloat(center.latitude), lng: parseFloat(center.longitude)}
  }

  onMarkerClose(targetMarker) {
    this._toggleMarker(targetMarker)
    this.forceUpdate()
  }

  _toggleMarker (marker) {
    this.markers.forEach(function (element) {
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
    var line = this.lines[polyline.key]
    line.isSelected = true
    this.lines.forEach(function (element, index) {
      if (index != polyline.key) {
        element.isSelected = false
      }
    })
    this.forceUpdate()
  }

  getOverlayView () {
    // Check if there is anything selected in the data source
    var returnData = undefined
    this.lines.forEach(function(line) {
      if (line.isSelected) {
        returnData = line
    }})
    return returnData
  }
}

export default App;
