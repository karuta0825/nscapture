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
      src: '',
    };
    this.toggleExpand = this.toggleExpand.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.selectVideo = this.selectVideo.bind(this);
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
        this.setState({ files: files, src:`${searchPath}/${files[0].name}` });
      })
  }

  selectVideo(order) {
    const selected = this.state.files[order];
    const searchPath = localStorage.getItem('savePath');
    this.setState({src: `${searchPath}/${selected.name}`});
  }

  render() {
    const { isExpand, files, src } = this.state;
    return (
      <div className={styles.wrapper}>
        <PlayList classs={isExpand ? 'wrapper--close' : 'wrapper--open'} files={files} refreshList={this.refreshList} selectVideo={this.selectVideo} />
        <Video src={src} isExpand={isExpand} toggleExpand={this.toggleExpand} />
      </div>
    );
  }
}
