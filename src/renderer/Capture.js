import React, { Component } from 'react';
import styles from '../css/app.css';


export default class Capture extends Component {

  render() {
    const {stream, onClick} = this.props;
    const url = stream && URL.createObjectURL(stream) || '';
    return (
      <div id={styles.capture}>
        <video id={styles.capture__video} src={url} autoPlay onClick={onClick}></video>
      </div>
    );
  }
}