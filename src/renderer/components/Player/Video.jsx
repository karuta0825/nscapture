import React, { Component } from 'react';
import ReactDom from 'react-dom';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import ChevronRight from 'material-ui-icons/ChevronRight';
import styles from './css/Video.css';

export default class Video extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if ( prevProps.src !== this.props.src ) {
      this.player.src =  this.props.src;
      this.player.currentTime =  60*60*24;
    }
  }

  componentDidMount() {
    this.player = ReactDom.findDOMNode(this.refs.player);
  }

  render() {
    const { isExpand, toggleExpand } = this.props;
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <IconButton className={styles.header__icon_zoom} color="primary" component="span" onClick={toggleExpand} >
            { isExpand ?
              <ChevronRight style={{ fontSize: 20 }} /> :
              <ChevronLeft style={{ fontSize: 20 }} />
            }
          </IconButton>
        </div>
        <div className={styles.body}>
          <video ref='player' className={styles.video} controls></video>
        </div>
      </div>
    );
  }
}