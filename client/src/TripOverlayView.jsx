import React from 'react'
import { OverlayView } from "react-google-maps";
import {Jumbotron, Button} from 'react-bootstrap';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
var dateFormat = require('dateformat');

function getPixelPositionOffset(width, height) {
  return { x: width, y: -(height / 2) };
}

export default class TripOverlayView extends React.Component {
  render() {
    const tripOverlayViewStyle = {
        margin: "20px",
        backgroundColor: "white"
    };

    const jumbotronStyle = {
      borderRadius: 15,
      padding: "20px",
      backgroundColor:'#e1e7f2',
      border: "1px solid #486189"
    }

    const profilePictureStyle = {
      width: 80,
      height: 80,
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      backgroundImage:  "url(" + this.props.inbound.friend.picture + ")" ,
      borderRadius: 40
    }

    var inboundStartDate = new Date(this.props.inbound.start_time)
    var inboundArrivalDate = new Date(this.props.inbound.arrival_time)
    var outboundStartDate = new Date(this.props.outbound.start_time)
    var outbundArrivalDate = new Date(this.props.outbound.arrival_time)

    var format = "dd.mm.yyyy h:MM"

    return (
      <OverlayView
        position={{
          lat: this.props.inbound.destination.location.latitude,
          lng: this.props.inbound.destination.location.longitude
        }}
        getPixelPositionOffset={getPixelPositionOffset}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >
      <div style={jumbotronStyle}>
       <img style={profilePictureStyle} src={this.props.inbound.friend.picture} />
       <h3>{this.props.inbound.friend.name}</h3>
       <h4>Visit {this.props.inbound.friend.name} for 2 days and only pay 100€ extra.</h4>
       <ListGroup>
          <ListGroupItem>
            Leave <span className="bold">{this.props.inbound.start.name}</span> at {dateFormat(inboundStartDate, format)}
          </ListGroupItem>
          <ListGroupItem>
            Arrive in <span className="bold">{this.props.inbound.destination.name}</span> at {dateFormat(inboundArrivalDate, format)}
          </ListGroupItem>
        </ListGroup>
        <ListGroup>
          <ListGroupItem>
            Leave <span className="bold">{this.props.outbound.start.name}</span> at {dateFormat(outboundStartDate, format)}
          </ListGroupItem>
          <ListGroupItem>
            Arrive in <span className="bold">{this.props.outbound.destination.name}</span> at {dateFormat(outbundArrivalDate, format)}
          </ListGroupItem>
       </ListGroup>
       <p><Button href="http://www.dubsmash.com" target="_blank" bsStyle="success">Book now</Button></p>
     </div>
      </OverlayView>
    )
  }

}
