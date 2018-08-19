// @flow
import { desktopCapturer } from 'electron';
import StreamConfig from './StreamConfig';
import CaptureStream from './CaptureStream';

const ManageStream = {

  getSources: (): Promise<Array<{id: string, name: string, thumbnail: Image}>> => (
    new Promise((res, rej) => {
      desktopCapturer.getSources(
        {
          types: ['window', 'screen'],
          thumbnailSize: { width: 50, height: 50 },
        },
        (err, sources) => {
          if (err) { rej(err); }
          res(sources);
        },
      );
    })
  ),

  getStream: (config: StreamConfig): Promise<CaptureStream> => {
    const setting = config.get();
    return navigator.mediaDevices.getUserMedia(setting)
      .then((stream: MediaStream) => (
        new CaptureStream(stream, config)
      ));
  },

};

export default ManageStream;
