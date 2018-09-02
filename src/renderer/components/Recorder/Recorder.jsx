// @flow
import * as React from 'react';
import { ipcRenderer as ipc } from 'electron';
import fs from 'fs';
import styles from './css/Recorder.css';
import type { ImgType } from './Thumbnails';
import Thumbnails from './Thumbnails';
import Capture from './Capture';
import CaptureStream from '../../logics/CaptureStream';
import StreamConfig from '../../logics/StreamConfig';
import ManageStream from '../../logics/ManageStream';

type StatesType = {
  thumbnails: Array<ImgType>,
  stream: ?CaptureStream,
  isRecord: boolean,
  hasAudio: boolean,
  size: string,
  selectedNum: ?number,
};

type PropsType = {

};

export default class Recorder extends React.Component<PropsType, StatesType> {
  config: StreamConfig;
  recorder: MediaRecorder;
  constructor(props: PropsType) {
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
    (this: any).selectThumbnail = this.selectThumbnail.bind(this);
    (this: any).recordOrStop = this.recordOrStop.bind(this);
    (this: any).refreshWindow = this.refreshWindow.bind(this);
    (this: any).changeSize = this.changeSize.bind(this);
    (this: any).hasAudioRecord = this.hasAudioRecord.bind(this);

    ipc.on('saved-file', (e, path) => {
      const { stream } = this.state;
      if (!stream) { return; }
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
    if (!stream) { return; }
    stream.clear();
    if (!isRecord) { this.recorder.stop(); }
    ipc.removeAllListeners('saved-file');
  }

  changeSize(width: number, height: number) {
    const { stream } = this.state;

    if (!stream) { return; }

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

    if (!stream) { return; }

    stream.change({ hasAudio: !hasAudio })
      .then((newStream) => {
        this.setState({ stream: newStream, isRecord: true, hasAudio: !hasAudio });
      })
      .catch(() => {
        this.setState({ isRecord: true, hasAudio: !hasAudio });
      });
  }

  selectThumbnail(item: ImgType, order: number) {
    const { stream } = this.state;
    const windowId = item.id;

    if (!stream) { return; }

    stream.change({ windowId })
      .then((newStream) => {
        this.setState({ stream: newStream, isRecord: true, selectedNum: order });
      });
  }


  refreshWindow() {
    const { stream } = this.state;
    let thumbnails;

    if (stream) { stream.clear(); }

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
    return (!localPath) ? '.' : localPath;
  }

  recordOrStop() {
    const { isRecord, stream } = this.state;
    const savePath = this.getSavePath();

    if (!stream) { return; }

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
