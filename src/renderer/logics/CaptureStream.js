// @flow
import StreamConfig from './StreamConfig';

export default class CaptureStream {
  stream: MediaStream | null;
  config: StreamConfig;
  recorder: MediaRecorder;
  chunks: Array<any> = [];

  constructor(stream: MediaStream, config: StreamConfig) {
    this.stream = stream;
    this.config = config;
    this.setRecorder(stream);
  }

  change(keyValues: any): Promise<CaptureStream> {
    this.clear();
    this.config.change(keyValues);
    const setting = this.config.get();
    return navigator.mediaDevices.getUserMedia(setting)
      .then((stream: MediaStream) => (
        new CaptureStream(stream, this.config)
      ));
  }

  extractStream(): MediaStream | null {
    return this.stream;
  }

  setRecorder(stream: MediaStream) {
    const options = { mimeType: 'video/webm' };
    this.recorder = new MediaRecorder(stream, options);
    this.recorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    this.recorder.onstop = () => {
      this.recorder = null;
    };
  }

  recordStart() {
    this.recorder.start();
  }

  recordStop() {
    this.recorder.stop();
  }

  clear() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.stream = null;
      this.recorder = null;
      this.chunks = [];
    }
  }
}
