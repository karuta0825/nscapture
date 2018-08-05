// @flow
import * as React from 'react';
import IconButton from 'material-ui/IconButton';
import FiberManualRecord from 'material-ui-icons/FiberManualRecord';
import Stop from 'material-ui-icons/Stop';
import ReactDom from 'react-dom';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import styles from './css/Capture.css';
import CaptureSizeSelect from './CaptureSizeSelect';
import Timer from './Timer';
import { getOS } from '../../../utils/Path';

type PropsType = {
  stream: any,
  isRecord: boolean,
  hasAudioRecord: () => {},
  hasAudio: boolean,
  size: string,
  onClick: any,
  changeSize: any
};

export default class Capture extends React.Component<PropsType> {
  componentDidMount() {
    this.player = ReactDom.findDOMNode(this.refs.player);
  }

  componentDidUpdate() {
    URL.revokeObjectURL(this.player.getAttribute('src'));
    this.player.setAttribute('src', URL.createObjectURL(this.props.stream));
  }

  player: any;

  showSvg(isRecord: boolean): React.Node {
    if (isRecord) {
      return <FiberManualRecord className={styles.body__action_svg_record} />;
    }
    return <Stop className={styles.body__action_svg_stop} />;
  }


  showAudioIcon(): null | React.Node {
    const {
      hasAudio, hasAudioRecord,
    } = this.props;

    if (getOS() !== 'win32') { return null; }
    return (
      <IconButton color="primary" component="span" onClick={hasAudioRecord}>
        {
        (hasAudio) ?
          <Mic style={{ fontSize: 20 }} />
        :
          <MicOff style={{ fontSize: 20 }} />
      }
      </IconButton>
    );
  }

  render(): React.Node {
    const {
      isRecord, size, onClick, changeSize,
    } = this.props;
    return (
      <div id={styles.wrapper}>
        <div className={styles.header}>
          <CaptureSizeSelect size={size} changeSize={changeSize} />
          {this.showAudioIcon()}
        </div>
        <div className={styles.body}>
          <video
            ref="player"
            className={styles.body__video}
            autoPlay
            muted
          />
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
