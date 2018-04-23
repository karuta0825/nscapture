import {desktopCapturer} from 'electron'

export default class DesktopCapturer {
  constructor(minWidth=1280, maxWidth=1280, minHeight=720, maxHeight=720) {
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.windowId;
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
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: windowId,
          minWidth: this.minWidth,
          maxWidth: this.maxWidth,
          minHeight: this.minHeight,
          maxHeight: this.maxHeight,
        }
      }
    })
  }

  resizeView(width, height) {
    this.minWidth = width;
    this.maxWidth = width;
    this.minHeight = height;
    this.maxHeight = height;
    return this.getStream(this.windowId);
  }

}
