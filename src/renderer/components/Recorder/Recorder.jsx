// @flow
import * as React from 'react';
import { ipcRenderer as ipc } from 'electron';
import fs from 'fs';
import styles from './css/Recorder.css';
import Thumbnails from './Thumbnails';
import Capture from './Capture';
import CaptureStream from '../../logics/CaptureStream';
import StreamConfig from '../../logics/StreamConfig';
import ManageStream from '../../logics/ManageStream';

export default class Recorder extends React.Component {
  config: StreamConfig;
  recorder: MediaRecorder;
  constructor(props) {
    super(props);
    const hasAudio = (localStorage.getItem('hasAudio') === 'true');
    const defaultSize = localStorage.getItem('size');
    this.config = new StreamConfig();
    this.state = {
      thumbnails: [],
      stream: null,
      isRecord: true,
      hasAudio,
      size: defaultSize || '1280x720',
      selectedNum: null,
    };
    this.selectThumbnail = this.selectThumbnail.bind(this);
    this.recordOrStop = this.recordOrStop.bind(this);
    this.refreshWindow = this.refreshWindow.bind(this);
    this.changeSize = this.changeSize.bind(this);
    this.hasAudioRecord = this.hasAudioRecord.bind(this);

    ipc.on('saved-file', (e, path) => {
      const { stream } = this.state;
      let reader = new FileReader();
      reader.onload = () => {
        const buffer = Buffer.from(reader.result);
        fs.writeFileSync(path, buffer);
        stream.change()
          .then((newStream) => {
            this.setState({ stream: newStream, isRecord: true });
            reader = null;
          });
      };
      reader.readAsArrayBuffer(stream.chunks[0]);
    });
  }

  componentWillMount() {
    this.refreshWindow();
  }

  componentWillUnmount() {
    const { stream, isRecord } = this.state;
    stream.clear();
    if (!isRecord) { this.recorder.stop(); }
    ipc.removeAllListeners('saved-file');
  }

  changeSize(width: number, height: number) {
    const { stream } = this.state;
    stream.change({
      minWidth: width,
      maxWidth: width,
      minHeight: height,
      maxHeight: height,
    })
      .then((newStream) => {
        const size = `${width}x${height}`;
        this.setState({ stream: newStream, isRecord: true, size });
      });
  }

  hasAudioRecord() {
    const { stream, hasAudio } = this.state;

    stream.change({ hasAudio: !hasAudio })
      .then((newStream) => {
        this.setState({ stream: newStream, isRecord: true, hasAudio: !hasAudio });
      })
      .catch((err) => {
        this.setState({isRecord: true, hasAudio: !hasAudio});
      });
  }

  selectThumbnail(item, order) {
    const { stream, config } = this.state;
    const windowId = item.id;
    stream.change({ windowId })
      .then((newStream) => {
        this.setState({ stream: newStream, isRecord: true, selectedNum: order });
      });
  }


  refreshWindow() {
    const { stream, hasAudio, size } = this.state;
    const [width, height] = size.split('x');
    let thumbnails;

    if (stream) {
      stream.clear();
    }

    ManageStream.getSources()
      .then((list): Promise<CaptureStream> => {
        thumbnails = list;
        this.config.change({ windowId: list[0].id });
        return ManageStream.getStream(this.config);
      })
      .then((newStream) => {
        this.setState({ stream: newStream, thumbnails, isRecord: true });
      });
  }

  getSavePath(): string {
    const localPath = localStorage.getItem('savePath');
    return (localPath !== 'null') ? localPath : '.';
  }

  recordOrStop() {
    const { isRecord, stream } = this.state;
    const savePath = this.getSavePath();

    if (isRecord) {
      stream.chunks = [];
      stream.recordStart();
      this.setState({ isRecord: false });
    } else {
      stream.recordStop();
      ipc.send('save-dialog', savePath);
    }
  }

  render(): React.Node {
    const {
      thumbnails,
      stream,
      size,
      isRecord,
      hasAudio,
      selectedNum,
    } = this.state;

    const rowStream = stream ? stream.extractStream() : null;

    return (
      <div id={styles.recordView}>
        <Thumbnails
          imgs={thumbnails}
          selectThumbnail={this.selectThumbnail}
          refreshWindow={this.refreshWindow}
          selectedNum={selectedNum}
        />
        <Capture
          stream={rowStream}
          size={size}
          onClick={this.recordOrStop}
          isRecord={isRecord}
          hasAudio={hasAudio}
          changeSize={this.changeSize}
          hasAudioRecord={this.hasAudioRecord}
        />
      </div>
    );
  }
}
