// @flow
import * as React from 'react';
import ReactDom from 'react-dom';
import { ipcRenderer as ipc } from 'electron';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import ChevronRight from 'material-ui-icons/ChevronRight';
import FolderOpen from 'material-ui-icons/FolderOpen';
import styles from './css/Video.css';

type PropsType = {
  isExpand: boolean,
  toggleExpand: () => {},
  openFile: (string) => {},
  src: string
};

export default class Video extends React.Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
    (this: any).onDrop = this.onDrop.bind(this);

    ipc.on('select-file', (e, path) => {
      if (!path) { return; }
      this.props.openFile(path);
    });
  }

  componentDidMount() {
    this.player = ReactDom.findDOMNode(this.refs.player);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.player.src =  this.props.src;
      this.player.currentTime = 60 * 60 * 24;
    }
  }

  componentWillUnmount() {
    ipc.removeAllListeners('select-file');
  }

  onDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file.type === 'video/webm' || file.type === 'video/mp4') {
      this.props.openFile(file.path);
    }
  }

  openFile() {
    ipc.send('select-file');
  }

  showInitView(src: string): React.Node | null {
    if (src) { return null; }
    return (
      <div className={styles.description}>
        <Typography variant="body2" color="white">
          <p className={styles.description__msg}>左の動画一覧から動画を選択してください</p>
          <p className={styles.description__msg}>任意の動画を再生するには、</p>
          <p className={styles.description__msg}>右上の開くボタンをクリックするか</p>
          <p className={styles.description__msg}>ここにファイルをドラッグ&ドロップしてください</p>
        </Typography>
      </div>
    );
  }

  render(): React.Node {
    const {
      isExpand,
      toggleExpand,
      src,
    } = this.props;

    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <IconButton
            className={styles.header__icon_zoom}
            color="primary"
            component="span"
            onClick={toggleExpand}
          >
            { isExpand ?
              <ChevronRight style={{ fontSize: 20 }} /> :
              <ChevronLeft style={{ fontSize: 20 }} />
            }
          </IconButton>
          <Button
            className={styles.header__icon_btn}
            color="primary"
            size="small"
            onClick={this.openFile}
          >
            <FolderOpen className={styles.header__icon_folderOpen} />
            <Typography
              variant="button"
              color="primary"
            >開く
            </Typography>
          </Button>
        </div>
        <div
          className={styles.body}
          onDragOver={e => e.preventDefault()}
          onDrop={this.onDrop}
        >
          {this.showInitView(src)}
          <video
            ref="player"
            className={(src) ? styles.video : styles.video__none}
            controls
          ></video>
        </div>
      </div>
    );
  }
}