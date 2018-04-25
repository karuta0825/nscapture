import {desktopCapturer} from 'electron'

export default class DesktopCapturer {
  constructor(minWidth=1280, maxWidth=1280, minHeight=720, maxHeight=720) {
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.windowId;
    this.hasAudio = false;
  }

  getSources() {
    return new Promise((res,rej) => {
      desktopCapturer.getSources(
        {types: ['window', 'screen'], thumbnailSize: {width:50, height:50}},
        (err, sources) => {
        if (err) {rej(err);}
        res(sources)
      });
    });
  }

  getStream(windowId) {
    this.windowId = windowId;
    const setting = this.toggleAudio();
    return navigator.mediaDevices.getUserMedia(
    {
      // audio: false,
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop'
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: this.windowId,
          minWidth: this.minWidth,
          maxWidth: this.maxWidth,
          minHeight: this.minHeight,
          maxHeight: this.maxHeight,
        }
      }
    }
    );
  }

  resizeView(width, height) {
    this.minWidth = width;
    this.maxWidth = width;
    this.minHeight = height;
    this.maxHeight = height;
    return this.getStream(this.windowId);
  }

  toggleAudio(windowId) {
    const hasAudio = this.hasAudio;
    this.hasAudio = !this.hasAudio;
    if (hasAudio) {
      return {
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        },
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: this.windowId,
            minWidth: this.minWidth,
            maxWidth: this.maxWidth,
            minHeight: this.minHeight,
            maxHeight: this.maxHeight,
          }
        }
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
        }
      }
    };
  }

}
