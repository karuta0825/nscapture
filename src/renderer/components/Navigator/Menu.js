import React, { Component } from 'react';
import styles from './css/Menu.css';
import { withRouter } from 'react-router-dom'
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import VideoLibrary from '@material-ui/icons/VideoLibrary';
import VideoCam from '@material-ui/icons/VideoCam';
import Build from '@material-ui/icons/Build';
import { getRootHtmlPath } from '../../../utils/Path';


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecorder: true,
      isPlayer: false,
      isSetting: false,
    }
    this.selectMenu = this.selectMenu.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  selectMenu(menuName) {
    const { history } = this.props;
    switch(menuName) {
      case 'recorder':
        history.push(getRootHtmlPath())
        this.setState({
          isRecorder: true,
          isPlayer: false,
          isSetting: false,
        });
        break;
      case 'player':
        history.push('/player')
        this.setState({
          isRecorder: false,
          isPlayer: true,
          isSetting: false,
        });
        break;
      case 'setting':
        history.push('/setting')
        this.setState({
          isRecorder: false,
          isPlayer: false,
          isSetting: true,
        })
        break;
      default:
        history.push(getRootHtmlPath())
        this.setState({
          isRecorder: true,
          isPlayer: false,
          isSetting: false,
        });
        break;
    }
  }

  isSelected(flag) {
    return flag ? styles.iconBtn_selected : styles.iconBtn;
  }

  render() {
    const {isRecorder, isPlayer, isSetting} = this.state;
    return (
      <div id={styles.itemWrapper}>
        <div className={styles.item}>
          <IconButton className={this.isSelected(isRecorder)} color='secondary' onClick={() => {this.selectMenu('recorder')}} >
            <VideoCam />
            <div className={styles.title}>録画</div>
          </IconButton>
        </div>

        <div className={styles.blank}></div>

        <div className={styles.item}>
          <IconButton className={this.isSelected(isPlayer)} color="secondary" onClick={() => {this.selectMenu('player')}}>
            <VideoLibrary />
            <div className={styles.title}>再生</div>
          </IconButton>
        </div>

        <div className={styles.blank}></div>

        <div className={styles.item}>
          <IconButton className={this.isSelected(isSetting)} color="secondary" onClick={() => {this.selectMenu('setting')}}>
            <Build />
            <div className={styles.title}>設定</div>
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withRouter(Menu);