// @flow
import * as React from 'react';
import Typography from 'material-ui/Typography';
import styles from './css/Timer.css';

type PropType = {
  isRecord: boolean
};

type StateType = {
  time: number,
  timerId: IntervalID | null
};

export default class Timer extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = {
      time: 0,
      timerId: null,
    };
  }

  shouldComponentUpdate(nextProps: PropType): boolean {
    if (nextProps.isRecord !== this.props.isRecord) {
      (nextProps.isRecord) ? this.clearTimer() : this.setTimer();
    }
    return true;
  }

  setTimer() {
    const timerId = setInterval(() => {
      const { time } = this.state;
      this.setState({ time: time + 1 });
    }, 1000);
    this.setState({ timerId });
  }

  clearTimer() {
    const { timerId } = this.state;
    if (timerId) { clearInterval(timerId); }
    this.setState({ time: 0, timerId: null });
  }

  formatTime(time: number): string {
    const zeroPad = (num: number): string => {
      if (num < 10) { return `0${num}`; }
      return String(num);
    };

    const hour = zeroPad(Math.floor(time / 60 / 60));
    const minuite = zeroPad(Math.floor(time / 60));
    const second = zeroPad(time % 60);

    return `${hour}:${minuite}:${second}`;
  }

  render(): React.Node {
    const { time } = this.state;
    return (
      <Typography className={styles.view} variant="body2">
        {this.formatTime(time)}
      </Typography>
    );
  }
}
