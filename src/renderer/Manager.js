import React, { Component } from 'react';
import styles from '../css/app.css';
import Thumbnails from './Thumbnails';
import DesktopCapture from './DesktopCapture';
import Capture from './Capture';
import { ipcRenderer as ipc} from 'electron';
import fs from 'fs';


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
    }
    this.selectThumbnail = this.selectThumbnail.bind(this);
    this.recoreOrStop = this.recoreOrStop.bind(this);

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
    this.dc.getSources()
    .then((list) => {
      this.setState({thumbnails:list})
      return this.dc.getStream(list[0].id)
    })
    .then((stream) => {
      this.setRecorder(stream);
      this.setState({stream: stream, isRecord: true});
    })
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

  // 同じ関数内で複数setStateしているのが気持ち悪いのか、一回で済ませるほうがいい?
  recoreOrStop() {
    const {recorder, chunks, isRecord} = this.state;

    if (isRecord) {
      this.setState({chunks:[]})
      recorder.start()
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
        <Thumbnails imgs={thumbnails} selectThumbnail={this.selectThumbnail}/>
        <Capture stream={stream} onClick={this.recoreOrStop} isRecord={isRecord}/>
      </div>
    );
  }
}
