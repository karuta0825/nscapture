import React, { Component } from 'react';
import styles from './css/Recorder.css';
import Thumbnails from './Thumbnails';
import DesktopCapture from '../../logics/DesktopCapture';
import Capture from './Capture';
import { ipcRenderer as ipc } from 'electron';
import fs from 'fs';

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
    }
    this.selectThumbnail = this.selectThumbnail.bind(this);
    this.recordOrStop = this.recordOrStop.bind(this);
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
    const {stream, isRecord} = this.state;
    stream && stream.getTracks().forEach((track)=>{
      track.stop();
    })
    if (!isRecord) { this.recorder.stop() }
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
    stream && stream.getTracks().forEach((track)=>{
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
    const {stream, hasAudio} = this.state;
    stream && stream.getTracks().forEach((track)=>{
      track.stop();
    })

    let thumbnails;
    this.dc.getSources()
    .then((list) => {
      thumbnails = list;
      return this.dc.getStream(list[0].id, hasAudio)
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
    const {isRecord, stream} = this.state;
    const savePath = this.getSavePath();

    if (isRecord) {
      this.chunks = [];
      this.recorder.start();
      this.setState({isRecord: false})
    }
    else {
      stream.getTracks().forEach((track)=>{
        track.stop();
      });
      this.recorder.stop();
      ipc.send('save-dialog', savePath);

      this.dc.getStream()
        .then((newStream) => {
          this.setRecorder(newStream);
          this.setState({stream: newStream, isRecord: true});
        })
    }
  }


  render() {
    const {thumbnails, stream, isRecord, hasAudio} = this.state;
    return (
      <div id={styles.recordView}>
        <Thumbnails imgs={thumbnails} selectThumbnail={this.selectThumbnail} refreshWindow={this.refreshWindow}/>
        <Capture stream={stream} onClick={this.recordOrStop} isRecord={isRecord} hasAudio={hasAudio} changeSize={this.changeSize} hasAudioRecord={this.hasAudioRecord}/>
      </div>
    );
  }
}
