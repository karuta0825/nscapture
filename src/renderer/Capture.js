import React, { Component } from 'react';
import styles from '../css/app.css';
import IconButton from 'material-ui/IconButton';
import FiberManualRecord from 'material-ui-icons/FiberManualRecord';
import Stop from 'material-ui-icons/Stop';
import CaptureSizeSelect from './CaptureSizeSelect';
import Typography from 'material-ui/Typography';
import Timer from './Timer';
import ReactDom from 'react-dom';


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
       return <FiberManualRecord className={styles.capture__body__action_svg_record} />
    }
    return <Stop className={styles.capture__body__action_svg_stop} />
  }

  render() {
    const {isRecord, onClick, changeSize} = this.props;
    return (
      <div id={styles.capture}>
        <div className={styles.capture__header}>
          <CaptureSizeSelect changeSize={changeSize} />
          <div>画面サイズ</div>
        </div>
        <div className={styles.capture__body}>
          <video ref='player' className={styles.capture__body__video} autoPlay></video>
          <IconButton className={styles.capture__body__action} onClick={onClick}>
            {this.showSvg(isRecord)}
          </IconButton>
        </div>
        <div className={styles.capture__footer}>
          <Timer isRecord={isRecord} />
        </div>
      </div>
    );
  }
}