import React from 'react'
import axios from 'axios';
import {Form, FormGroup, Button, ControlLabel} from 'react-bootstrap';
import Typeahead from 'react-bootstrap-typeahead';
import DatePicker from "react-bootstrap-date-picker";
var dateFormat = require('dateformat');

import './SearchForm.css';

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      origin: {},
      destination: {},
      date: '',
      arrivalDate: ''
    }
    this.originData = []
    this.destinationData = []
  }

  render() {
    const formGrouStyle = {
        margin: "20px"
    };

    return (
      <Form inline action="#">
        <FormGroup style={formGrouStyle}>
          <ControlLabel>Origin</ControlLabel>
          <Typeahead
            options={this.originData} onInputChange={this.originInputChanged.bind(this)} onChange={this.originUpdated.bind(this)}/>
        </FormGroup>
        <FormGroup style={formGrouStyle}>
          <ControlLabel>Destination</ControlLabel>
            <Typeahead
              options={this.destinationData}
              onInputChange={this.destinationInputChanged.bind(this)} onChange={this.destinationUpdated.bind(this)} />
        </FormGroup>
        <FormGroup style={formGrouStyle}>
            <ControlLabel>Departue Date</ControlLabel><br></br>
              <DatePicker value={this.state.date} onChange={this.dateUpdated.bind(this)}/>
        </FormGroup>
        <FormGroup style={formGrouStyle}>
            <ControlLabel>Arrival date</ControlLabel><br></br>
              <DatePicker value={this.state.arrivalDate} onChange={this.arrivalDateUpdated.bind(this)}/>
        </FormGroup>
        <FormGroup>
          <br></br>
          <Button type="submit" onClick={this.submitForm.bind(this)}>
            Submit
          </Button>
        </FormGroup>
      </Form>
    )
  }

  destinationUpdated (input) {
    this.setState({destination: input[0].object})
    console.log(this.state)
  }

  dateUpdated (input) {
    this.setState({date: input})
    console.log(this.state)
  }

  arrivalDateUpdated (input) {
    this.setState({arrivalDate: input})
    console.log(this.state)
 }

  originUpdated (input) {
    this.setState({origin: input[0].object})
    console.log(this.state)
  }

  originInputChanged (input) {
    this.doSuggestionRequest(input, "originData")
  }

  destinationInputChanged (input) {
    this.doSuggestionRequest(input, "destinationData")
  }

  doSuggestionRequest (query, varName) {
    axios.post('http://localhost:8000/1/airport_suggest', {'query': query})
      .then(res => {
        this[varName] = res.data.Places.map(function (element) {
          return {
            label: element.PlaceName,
            object: element
          }
        })
        this.forceUpdate()
    }).catch(function (error) {
      // TODO: Add error handling
      console.log(error);
    });
  }

  submitForm () {
    console.log(this.state)

    var format = "yyyy-mm-dd"

    axios.post('http://localhost:8000/1/flights', {
      'from': this.state.origin.CityId,
      'to': this.state.destination.CityId,
      'from_human': this.state.origin.PlaceName,
      'to_human': this.state.destination.PlaceName,
      'departure': dateFormat(this.state.date, format),
      'return': dateFormat(this.state.arrivalDate, format),
      'facebookId': "1"
    }).then(res => {
        this.props.onSearchFinished(res)
    }).catch(function (error) {
      // TODO: Add error handling
      console.log(error);
    });
  }
}
