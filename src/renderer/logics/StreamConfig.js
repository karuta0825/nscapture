// @flow

export default class StreamConfig {
  windowId: string;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  hasAudio: boolean;

  constructor(
    windowId: string,
    minWidth: number = 1280,
    maxWidth: number = 1280,
    minHeight: number = 720,
    maxHeight: number = 720,
    hasAudio: boolean = false,
  ) {
    this.windowId = windowId;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.hasAudio = hasAudio;
  }

  /**
   * 設定情報を変更する
   * @param  {?windowId: string} keyValues.windowId
   * @param  {?minWidth: number} keyValues.minWidth
   * @param  {?maxWidth: number} keyValues.maxWidth
   * @param  {?minHeight: number} keyValues.minHeight
   * @param  {?maxHeight: number} keyValues.maxHeight
   * @param  {?hasAudio boolean} keyValues.hasAudio
   * @return {this}
   */
  change(keyValues) {
    if (!keyValues) { return; }
    Object.keys(keyValues).forEach((key) => {
      if (this.hasOwnProperty(key)) {
        this[key] = keyValues[key];
      }
    });
  }

  get(): any {
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
}
