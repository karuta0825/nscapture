import React, { Component } from 'react';
import { ipcRenderer as ipc } from 'electron';
import fs from 'fs';
import styles from './css/Recorder.css';
import Thumbnails from './Thumbnails';
import DesktopCapture from '../../logics/DesktopCapture';
import Capture from './Capture';

export default class Manager extends Component {
  constructor(props) {
    super(props);
    const hasAudio = ( localStorage.getItem('hasAudio')  === 'true' );
    const defaultSize = localStorage.getItem('size');
    this.dc = new DesktopCapture();
    this.chunks = [];
    this.recorder = null;
    this.state = {
      thumbnails: [],
      stream: null,
      isRecord: true,
      hasAudio: hasAudio,
      size: defaultSize || '1280x720',
      selectedNum: null,
    }
    this.selectThumbnail = this.selectThumbnail.bind(this);
    this.recordOrStop = this.recordOrStop.bind(this);
    this.refreshWindow = this.refreshWindow.bind(this);
    this.changeSize = this.changeSize.bind(this);
    this.hasAudioRecord = this.hasAudioRecord.bind(this);

    ipc.on('saved-file', (e,path) => {
      const { stream } = this.state;
      const reader = new FileReader()
      reader.onload = () => {
        const buffer = Buffer.from(reader.result)
        fs.writeFileSync(path, buffer);
        this.dc.clearStream(stream);
        this.dc.getStream()
          .then((newStream) => {
            this.setRecorder(newStream);
            this.setState({stream: newStream, isRecord: true});
          });
      }
      reader.readAsArrayBuffer(this.chunks[0]);
    })

  }

  componentWillMount() {
    this.refreshWindow();
  }

  componentWillUnmount() {
    const {stream, isRecord} = this.state;
    this.dc.clearStream(stream);
    if (!isRecord) { this.recorder.stop() }
    ipc.removeAllListeners('saved-file');
  }

  setRecorder(stream = this.state.stream) {
    const options = { mimeType: 'video/webm' };
    let recorder = new MediaRecorder(stream, options);
    recorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    recorder.onstop = () => {
      recorder = null;
    };
    this.recorder = recorder;
    this.chunks = [];
  }

  changeSize(width, height) {
    const {stream} = this.state;
    this.dc.clearStream(stream);
    this.dc.resizeView(width, height)
      .then((newStream) => {
        const size = `${width}x${height}`;
        this.setRecorder(newStream);
        this.setState({stream: newStream, isRecord: true, size: size});
      })
  }

  hasAudioRecord() {
    const {stream, hasAudio} = this.state;
    this.dc.clearStream(stream);
    this.dc.toggleAudio(!hasAudio)
      .then((newStream) => {
        this.setRecorder(newStream);
        this.setState({stream: newStream, isRecord: true, hasAudio: !hasAudio});
      })
      .catch((err) => {
        this.setState({isRecord: true, hasAudio: !hasAudio});
      });
  }

  selectThumbnail(item, order) {
    const { stream } = this.state;
    const windowId = item.id;
    this.dc.clearStream(stream);
    this.dc.getStream(windowId)
      .then((newStream) => {
        this.setRecorder(newStream);
        this.setState({stream: newStream, isRecord: true, selectedNum: order});
      })
  }


  refreshWindow() {
    const { stream, hasAudio } = this.state;
    const [ width, height ] = this.state.size.split('x');

    this.dc.clearStream(stream);

    let thumbnails;
    this.dc.getSources()
    .then((list) => {
      thumbnails = list;
      return this.dc.getStream(list[0].id, hasAudio, width, height);
    })
    .then((newStream) => {
      this.setRecorder(newStream);
      this.setState({stream: newStream, thumbnails: thumbnails, isRecord: true});
    })
  }

  getSavePath() {
    const localPath = localStorage.getItem('savePath');
    return (localPath !== 'null') ? localPath : '.';
  }

  recordOrStop() {
    const { isRecord, stream } = this.state;
    const savePath = this.getSavePath();

    if (isRecord) {
      this.chunks = [];
      this.recorder.start();
      this.setState({isRecord: false})
    }
    else {
      this.recorder.stop();
      ipc.send('save-dialog', savePath);
    }
  }


  render() {
    const {thumbnails, stream, size, isRecord, hasAudio, selectedNum} = this.state;
    return (
      <div id={styles.recordView}>
        <Thumbnails imgs={thumbnails} selectThumbnail={this.selectThumbnail} refreshWindow={this.refreshWindow} selectedNum={selectedNum} />
        <Capture stream={stream} size={size} onClick={this.recordOrStop} isRecord={isRecord} hasAudio={hasAudio} changeSize={this.changeSize} hasAudioRecord={this.hasAudioRecord}/>
      </div>
    );
  }
}
