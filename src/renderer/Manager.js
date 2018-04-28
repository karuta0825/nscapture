import React, { Component } from 'react';
import styles from '../css/app.css';
import Thumbnails from './Thumbnails';
import DesktopCapture from './DesktopCapture';
import Capture from './Capture';
import { ipcRenderer as ipc} from 'electron';
import fs from 'fs';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PhotoCamera from '@material-ui/icons/PhotoCamera';


export default class Manager extends Component {
  constructor(props) {
    super(props);
    this.dc = new DesktopCapture();
    this.chunks = [];
    this.recorder = null;
    this.state = {
      thumbnails: [],
      stream: null,
      isRecord: true,
      hasAudio: false,
    }
    this.selectThumbnail = this.selectThumbnail.bind(this);
    this.recoreOrStop = this.recoreOrStop.bind(this);
    this.refreshWindow = this.refreshWindow.bind(this);
    this.changeSize = this.changeSize.bind(this);
    this.hasAudioRecord = this.hasAudioRecord.bind(this);

    ipc.on('saved-file', (e,path) => {
      const reader = new FileReader()
      reader.onload = () => {
        const buffer = Buffer.from(reader.result)
        fs.writeFileSync(path, buffer);
      }
      reader.readAsArrayBuffer(this.chunks[0]);
    })

  }

  componentWillMount() {
    this.refreshWindow();
  }

  componentWillUnmount() {
    ipc.removeAllListeners('saved-file');
  }

  setRecorder(stream = this.state.stream) {
    const options = {mimeType: 'video/webm'};
    const recorder = new MediaRecorder(stream, options);
    recorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    this.recorder = recorder;
    this.chunks = [];
  }

  changeSize(width, height) {
    const {stream} = this.state;
    stream.getTracks().forEach((track)=>{
      track.stop();
    })
    this.dc.resizeView(width, height)
      .then((newStream) => {
        this.setRecorder(newStream);
        this.setState({stream: newStream, isRecord: true});
      })
  }


  hasAudioRecord() {
    const {stream, hasAudio} = this.state;
    stream.getTracks().forEach((track)=>{
      track.stop();
    })
    this.dc.toggleAudio(!hasAudio)
      .then((newStream) => {
        this.setRecorder(newStream);
        this.setState({stream: newStream, isRecord: true, hasAudio: !hasAudio});
      })
      .catch((err) => {
        this.setState({isRecord: true, hasAudio: !hasAudio});
      });
  }

  selectThumbnail(item) {
    const windowId = item.id;
    this.state.stream.getTracks().forEach((track)=>{
      track.stop();
    })
    this.dc.getStream(windowId)
      .then((stream) => {
        this.setRecorder(stream);
        this.setState({stream: stream, isRecord: true});
      })
  }


  refreshWindow() {
    const {stream} = this.state;
    stream && stream.getTracks().forEach((track)=>{
      track.stop();
    })

    let thumbnails;
    this.dc.getSources()
    .then((list) => {
      thumbnails = list;
      return this.dc.getStream(list[0].id)
    })
    .then((newStream) => {
      this.setRecorder(newStream);
      this.setState({stream: newStream, thumbnails: thumbnails, isRecord: true});
    })
  }

  recoreOrStop() {
    const {isRecord, stream} = this.state;

    if (isRecord) {
      this.chunks = [];
      this.recorder.start();
    }
    else {
      this.recorder.stop();
      this.setRecorder();
      ipc.send('save-dialog');
    }

    this.setState({isRecord:!isRecord})
  }


  render() {
    const {thumbnails, stream, isRecord, hasAudio} = this.state;
    return (
      <div id={styles.wrapper}>
        <div id={styles.menu}>
          <IconButton className={styles.menu_icon} color="primary" component="span">
            <PhotoCamera />
            <div className={styles.menu_title}>title</div>
          </IconButton>
          <IconButton className={styles.menu_icon} color="primary" aria-label="Add to shopping cart">
            <AddShoppingCartIcon />
            <div className={styles.menu_title}>title</div>
          </IconButton>
        </div>
        <Thumbnails imgs={thumbnails} selectThumbnail={this.selectThumbnail} refreshWindow={this.refreshWindow}/>
        <Capture stream={stream} onClick={this.recoreOrStop} isRecord={isRecord} hasAudio={hasAudio} changeSize={this.changeSize} hasAudioRecord={this.hasAudioRecord}/>
      </div>
    );
  }
}
