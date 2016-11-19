import React from 'react'
import axios from 'axios';
import SearchInput, {createFilter} from 'react-search-input'
import {FormGroup, FormControl, Button, ControlLabel} from 'react-bootstrap';
import Typeahead from 'react-bootstrap-typeahead';
import DatePicker from "react-bootstrap-date-picker";

import './SearchForm.css';

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      origin: {},
      destination: {},
      date: ''
    }
    this.originData = []
    this.destinationData = []
  }

  render() {
    const style = {
        color: "red"
    };

    return (
      <FormGroup>
        <ControlLabel>Origin</ControlLabel>
        <Typeahead
          options={this.originData} onInputChange={this.originInputChanged.bind(this)} onChange={this.originUpdated.bind(this)}/>
        <ControlLabel>Destination</ControlLabel>
          <Typeahead
            options={this.destinationData}
            onInputChange={this.destinationInputChanged.bind(this)} onChange={this.destinationUpdated.bind(this)} />
          <ControlLabel>Date</ControlLabel>
            <DatePicker value={this.state.date} onChange={this.dateUpdated.bind(this)}/>
              <Button type="submit">
            Submit
          </Button>
      </FormGroup>
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
      console.log(error);
    });
  }
}
