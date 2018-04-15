import React, { Component } from 'react';
import styles from '../css/app.css';
import IconButton from 'material-ui/IconButton';
import FiberManualRecord from 'material-ui-icons/FiberManualRecord';
import Stop from 'material-ui-icons/Stop';

export default class Capture extends Component {

  showSvg(isRecord) {
    if (isRecord) {
       return <FiberManualRecord className={styles.capture__action_svg_record} />
    }
    return <Stop className={styles.capture__action_svg_stop} />
  }

  render() {
    const {stream, isRecord, onClick} = this.props;
    const url = stream && URL.createObjectURL(stream) || '';
    return (
      <div id={styles.capture}>
        <video id={styles.capture__video} src={url} autoPlay></video>
        <IconButton id={styles.capture__action} onClick={onClick}>
          {this.showSvg(isRecord)}
        </IconButton>
      </div>
    );
  }
}