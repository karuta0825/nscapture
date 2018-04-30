import React, { Component } from 'react';
import styles from './css/Player.css';
import PlayList from './PlayList';
import Video from './Video';

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpand: false,
    };
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    const { isExpand } = this.state;
    this.setState({ isExpand: !isExpand });
  }

  render() {
    const { isExpand } = this.state;
    return (
      <div className={styles.wrapper}>
        <PlayList classs={isExpand ? 'wrapper--close' : 'wrapper--open'} />
        <Video isExpand={isExpand} toggleExpand={this.toggleExpand} />
      </div>
    );
  }
}
