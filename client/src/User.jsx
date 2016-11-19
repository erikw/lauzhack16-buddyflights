
import React, {PropTypes, Component} from 'react';

import styles from './User_styles.js';

export default class User extends Component {
  static propTypes = {
    text: PropTypes.string
  };

  static defaultProps = {};

  render() {
    return (
       <div style={styles.userStyle}>
          {this.props.text}
       </div>
    );
  }
}
