import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { ipcRenderer as ipc } from 'electron';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import ChevronRight from 'material-ui-icons/ChevronRight';
import FolderOpen from 'material-ui-icons/FolderOpen';
import styles from './css/Video.css';

export default class Video extends Component {
  constructor(props) {
    super(props);

    ipc.on('select-file', (e, path) => {
      if (!path) {return;}
      this.props.openFile(path);
    });
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

  componentWillUnmount() {
    ipc.removeAllListeners('select-file');
  }

  openFile() {
    ipc.send('select-file');
  }

  showInitView(src) {
    if (src) { return; }
    return (
      <div className={styles.description}>
        <Typography variant='body2'>
          <p>動画一覧から動画を選択してください</p>
          <p>また右上の開くボタンから任意の動画が再生できます</p>
        </Typography>
      </div>
    );
  }

  render() {
    const { isExpand, toggleExpand, src } = this.props;
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <IconButton className={styles.header__icon_zoom} color="primary" component="span" onClick={toggleExpand} >
            { isExpand ?
              <ChevronRight style={{ fontSize: 20 }} /> :
              <ChevronLeft style={{ fontSize: 20 }} />
            }
          </IconButton>

        <Button className={styles.header__icon_btn} color='primary' size="small" onClick={this.openFile}>
          <FolderOpen className={styles.header__icon_folderOpen} />
            <Typography variant='button' color='primary'>開く</Typography>
        </Button>

        </div>
        <div className={styles.body}>
          {this.showInitView(src)}
          <video ref='player' className={(src) ? styles.video : styles.video__none} controls></video>
        </div>
      </div>
    );
  }
}