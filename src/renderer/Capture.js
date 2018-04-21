import React, { Component } from 'react';
import styles from '../css/app.css';
import IconButton from 'material-ui/IconButton';
import FiberManualRecord from 'material-ui-icons/FiberManualRecord';
import Stop from 'material-ui-icons/Stop';
import CaptureSizeSelect from './CaptureSizeSelect';
import Typography from 'material-ui/Typography';

export default class Capture extends Component {

  showSvg(isRecord) {
    if (isRecord) {
       return <FiberManualRecord className={styles.capture__body__action_svg_record} />
    }
    return <Stop className={styles.capture__body__action_svg_stop} />
  }

  formatTime(time) {

    const zeroPad = (time) => {
      if ( time < 10 ) { return `0${time}`}
      return time;
    }

    const hour = zeroPad(Math.floor(time/60/60));
    const minuite = zeroPad(Math.floor(time/60));
    const second = zeroPad(time%60);

    return `${hour}:${minuite}:${second}`

  }

  render() {
    const {stream, isRecord, onClick, time} = this.props;
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
          <Typography className={styles.capture__footer__timer} variant='body2'>
            {this.formatTime(time)}
          </Typography>
        </div>
      </div>
    );
  }
}