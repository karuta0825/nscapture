import React, { Component } from 'react';
import styles from './css/Capture.css';
import IconButton from 'material-ui/IconButton';
import FiberManualRecord from 'material-ui-icons/FiberManualRecord';
import Stop from 'material-ui-icons/Stop';
import CaptureSizeSelect from './CaptureSizeSelect';
import Timer from './Timer';
import ReactDom from 'react-dom';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import { getOS } from '../../../utils/Path';

export default class Capture extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    URL.revokeObjectURL(this.player.getAttribute('src'));
    this.player.setAttribute('src', URL.createObjectURL(this.props.stream));
  }

  componentDidMount() {
    this.player = ReactDom.findDOMNode(this.refs.player);
  }

  showSvg(isRecord) {
    if (isRecord) {
       return <FiberManualRecord className={styles.body__action_svg_record} />
    }
    return <Stop className={styles.body__action_svg_stop} />
  }

  showAudio(hasAudio) {
    if (hasAudio) {
      return <Mic style={{ fontSize: 20 }}/>
    }
    return  <MicOff style={{ fontSize: 20 }} />
  }

  showAudioIcon() {
    const { isRecord, hasAudioRecord } = this.props;
    if (getOS() !== 'win32') { return ;}
    return (
      <IconButton color="primary" component="span" onClick={hasAudioRecord}>
        {this.showAudio(hasAudio)}
      </IconButton>
    );
  }

  render() {
    const { isRecord, size, hasAudio, onClick, changeSize } = this.props;
    return (
      <div id={styles.wrapper}>
        <div className={styles.header}>
          <CaptureSizeSelect size={size} changeSize={changeSize} />
          {this.showAudioIcon()}
        </div>
        <div className={styles.body}>
          <video ref='player' className={styles.body__video} autoPlay muted></video>
          <IconButton className={styles.body__action} onClick={onClick}>
            {this.showSvg(isRecord)}
          </IconButton>
        </div>
        <div className={styles.footer}>
          <Timer isRecord={isRecord} />
        </div>
      </div>
    );
  }
}