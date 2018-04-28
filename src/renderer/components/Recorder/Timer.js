import React, { Component } from 'react';
import styles from '../../../css/app.css';
import Typography from 'material-ui/Typography';


export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      timerId: null,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isRecord !== this.props.isRecord) {
      (nextProps.isRecord) ? this.clearTimer() : this.setTimer();
    }
    return true;
  }

  setTimer() {
    const timerId = setInterval(() => {
      const time = this.state.time;
      this.setState({time: time+1})
    }, 1000);
    this.setState({timerId: timerId})
  }

  clearTimer() {
    const {timerId} = this.state;
    timerId && clearInterval(timerId);
    this.setState({time: 0, timerId: null});
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
    const {isRecord} = this.props;
    const {time} = this.state;
    return (
      <Typography className={styles.capture__footer__timer} variant='body2'>
        {this.formatTime(time)}
      </Typography>
    );
  }

}