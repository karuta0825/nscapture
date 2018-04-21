import React, { Component } from 'react';
import styles from '../css/app.css';
import IconButton from 'material-ui/IconButton';
import FiberManualRecord from 'material-ui-icons/FiberManualRecord';
import Stop from 'material-ui-icons/Stop';
import CaptureSizeSelect from './CaptureSizeSelect';

export default class Capture extends Component {

  showSvg(isRecord) {
    if (isRecord) {
       return <FiberManualRecord className={styles.capture__body__action_svg_record} />
    }
    return <Stop className={styles.capture__body__action_svg_stop} />
  }

  render() {
    const {stream, isRecord, onClick} = this.props;
    const url = stream && URL.createObjectURL(stream) || '';
    return (
      <div id={styles.capture}>
        <div className={styles.capture__header}>
          <CaptureSizeSelect />
          <div>画面サイズ</div>
        </div>
        <div className={styles.capture__body}>
          <video className={styles.capture__body__video} src={url} autoPlay></video>
          <IconButton className={styles.capture__body__action} onClick={onClick}>
            {this.showSvg(isRecord)}
          </IconButton>
        </div>
        <div className={styles.capture__footer}>
          Timer
        </div>
      </div>
    );
  }
}