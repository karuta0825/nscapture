// @flow
import { desktopCapturer } from 'electron';

export default class DesktopCapturer {
  windowId: string;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  hasAudio: boolean;
  constructor(
    minWidth: number = 1280,
    maxWidth: number = 1280,
    minHeight: number = 720,
    maxHeight: number = 720,
    hasAudio: boolean = false,
  ) {
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.hasAudio = hasAudio;
  }

  getSources(): Promise<Array<{id: string, name: string, thumbnail: Image}>> {
    return new Promise((res, rej) => {
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
    });
  }

  getStream(
    windowId: string = this.windowId,
    hasAudio: boolean = this.hasAudio,
    width: ?number,
    height: ?number,
  ): Promise<MediaStream> {
    this.windowId = windowId;
    this.hasAudio = hasAudio;
    if (width) {
      this.minWidth = width;
      this.maxWidth = width;
    }
    if (height) {
      this.minHeight = height;
      this.maxHeight = height;
    }
    const setting = this.getSetting();
    return navigator.mediaDevices.getUserMedia(setting);
  }

  resizeView(width: number, height: number): Promise<MediaStream> {
    this.minWidth = width;
    this.maxWidth = width;
    this.minHeight = height;
    this.maxHeight = height;
    return this.getStream();
  }

  getSetting(): any {
    if (this.hasAudio) {
      return {
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop',
          },
        },
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: this.windowId,
            minWidth: this.minWidth,
            maxWidth: this.maxWidth,
            minHeight: this.minHeight,
            maxHeight: this.maxHeight,
          },
        },
      };
    }
    return {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: this.windowId,
          minWidth: this.minWidth,
          maxWidth: this.maxWidth,
          minHeight: this.minHeight,
          maxHeight: this.maxHeight,
        },
      },
    };
  }

  toggleAudio(hasAudio: boolean = false): Promise<MediaStream> {
    this.hasAudio = hasAudio;
    return this.getStream(this.windowId, this.hasAudio);
  }

  clearStream(stream: MediaStream) {
    stream && stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}
