import React, { Component } from 'react';
import styles from '../../../css/app.css';
import { withRouter } from 'react-router-dom'
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import VideoLibrary from '@material-ui/icons/VideoLibrary';
import VideoCam from '@material-ui/icons/VideoCam';
import Build from '@material-ui/icons/Build';
import { getRootHtmlPath } from '../../../utils/Path';


class Menu extends Component {
  render() {
    const {location, history } = this.props;
    return (
      <div id={styles.menu}>
        <IconButton className={styles.menu_icon} color='secondary' onClick={() => {history.push(getRootHtmlPath())}} >
          <VideoCam />
          <div className={styles.menu_title}>録画</div>
        </IconButton>
        <IconButton className={styles.menu_icon} color="secondary" onClick={() => {history.push('/player')}}>
          <VideoLibrary />
          <div className={styles.menu_title}>再生</div>
        </IconButton>
        <IconButton className={styles.menu_icon} color="secondary" onClick={() => {history.push('/setting')}}>
          <Build />
          <div className={styles.menu_title}>設定</div>
        </IconButton>
      </div>
    );
  }
}

export default withRouter(Menu);