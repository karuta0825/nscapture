// @flow
import * as React from 'react';
import styles from './css/Player.css';
import PlayList from './PlayList';
import Video from './Video';
import { filterVideoFile } from '../../../utils/File';
import type { SourcesType } from '../../logics/DesktopCapture';

type PropsType = {};

type StatesType = {
  isExpand: boolean,
  files: Array<SourcesType>,
  src: any,
  selectedItemNum: number | null
};

export default class Player extends React.Component<PropsType, StatesType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isExpand: false,
      files: [],
      src: null,
      selectedItemNum: null,
    };
    (this: any).toggleExpand = this.toggleExpand.bind(this);
    (this: any).refreshList = this.refreshList.bind(this);
    (this: any).selectVideo = this.selectVideo.bind(this);
    (this: any).openFile = this.openFile.bind(this);
  }

  componentWillMount() {
    this.refreshList();
  }

  toggleExpand() {
    const { isExpand } = this.state;
    this.setState({ isExpand: !isExpand });
  }

  refreshList() {
    const searchPath = localStorage.getItem('savePath');
    if (!searchPath) { return; }
    filterVideoFile(searchPath)
      .then((files) => {
        this.setState({ files });
      });
  }

  selectVideo(order: number) {
    const selected = this.state.files[order];
    const searchPath = localStorage.getItem('savePath');
    this.setState({ src: `${searchPath}/${selected.name}`, selectedItemNum: order });
  }

  openFile(src: string) {
    this.setState({ src, selectedItemNum: null });
  }

  render(): React.Node {
    const {
      isExpand,
      files,
      src,
      selectedItemNum,
    } = this.state;

    return (
      <div className={styles.wrapper}>
        <PlayList
          classs={isExpand ? 'wrapper--close' : 'wrapper--open'}
          files={files}
          refreshList={this.refreshList}
          selectVideo={this.selectVideo}
          selectedItemNum={selectedItemNum}
        />
        <Video
          src={src}
          isExpand={isExpand}
          toggleExpand={this.toggleExpand}
          openFile={this.openFile}
        />
      </div>
    );
  }
}
