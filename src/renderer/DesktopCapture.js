import {desktopCapturer} from 'electron'

export default class DesktopCapturer {
  constructor(minWidth=1280, maxWidth=1280, minHeight=720, maxHeight=720) {
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
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

  async setStream(idx) {
    const srcs = await this.getSources();
    return this.getStream(srcs[idx].id);
  }

}
