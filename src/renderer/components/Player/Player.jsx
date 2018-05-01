import React, { Component } from 'react';
import styles from './css/Player.css';
import PlayList from './PlayList';
import Video from './Video';
import { filterVideoFile } from '../../../utils/File';

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpand: false,
      files: [],
      src: null,
      selectedItemNum: null,
    };
    this.toggleExpand = this.toggleExpand.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.selectVideo = this.selectVideo.bind(this);
    this.openFile = this.openFile.bind(this);
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
        this.setState({ files: files });
      })
  }

  selectVideo(order) {
    const selected = this.state.files[order];
    const searchPath = localStorage.getItem('savePath');
    this.setState({src: `${searchPath}/${selected.name}`, selectedItemNum: order});
  }

  openFile(src) {
    this.setState({src:src, selectedItemNum: null});
  }

  render() {
    const { isExpand, files, src, selectedItemNum } = this.state;
    return (
      <div className={styles.wrapper}>
        <PlayList classs={isExpand ? 'wrapper--close' : 'wrapper--open'} files={files} refreshList={this.refreshList} selectVideo={this.selectVideo} selectedItemNum={selectedItemNum}/>
        <Video src={src} isExpand={isExpand} toggleExpand={this.toggleExpand} openFile={this.openFile}/>
      </div>
    );
  }
}
