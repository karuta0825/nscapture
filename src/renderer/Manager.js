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
    this.state = {
      thumbnails : [],
      stream : '',
      recorder : null,
      chunks : [],
      isRecord : true,
      time: 0,
    }
    this.selectThumbnail = this.selectThumbnail.bind(this);
    this.recoreOrStop = this.recoreOrStop.bind(this);
    this.refreshWindow = this.refreshWindow.bind(this);

    ipc.on('saved-file', (e,path) => {
      const reader = new FileReader()
      reader.onload = () => {
        const buffer = Buffer.from(reader.result)
        fs.writeFileSync(path, buffer);
      }
      reader.readAsArrayBuffer(this.state.chunks[0]);
    })

  }

  componentWillMount() {
    this.refreshWindow();
  }

  componentWillUnmount() {
    ipc.removeAllListeners('saved-file');
  }

  setRecorder(stream = this.state.stream) {
    const {chunks} = this.state;
    const options = {mimeType: 'video/webm'};
    const recorder = new MediaRecorder(stream, options);
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
      this.setState({chunks:chunks});
    };
    this.setState({recorder: recorder, chunks: []});
  }

  selectThumbnail(item) {
    const windowId = item.id;
    this.dc.getStream(windowId)
      .then((stream) => {
        this.setRecorder(stream);
        this.setState({stream: stream, isRecord: true});
      });
  }

  refreshWindow() {
    let thumbnails;
    this.dc.getSources()
    .then((list) => {
      thumbnails = list;
      return this.dc.getStream(list[0].id)
    })
    .then((stream) => {
      this.setRecorder(stream);
      this.setState({stream: stream, thumbnails: thumbnails, isRecord: true});
    })
  }

  recoreOrStop() {
    const {recorder, chunks, isRecord} = this.state;

    if (isRecord) {
      this.setState({chunks:[]})
      recorder.start();
    }
    else {
      recorder.stop();
      this.setRecorder();
      ipc.send('save-dialog');

    }

    this.setState({isRecord:!isRecord})
  }


  render() {
    const {thumbnails, stream, isRecord} = this.state;
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
        <Capture stream={stream} onClick={this.recoreOrStop} isRecord={isRecord} />
      </div>
    );
  }
}
