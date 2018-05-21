// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import VideoLibrary from '@material-ui/icons/VideoLibrary';
import VideoCam from '@material-ui/icons/Videocam';
import Build from '@material-ui/icons/Build';
import styles from './css/Menu.css';
import { getRootHtmlPath } from '../../../utils/Path';

type PropsType = {
  history: any
};

type StatesType = {
  isRecorder: boolean,
  isPlayer: boolean,
  isSetting: boolean
};

function isSelected(flag: boolean): string {
  return flag ? styles.iconBtn_selected : styles.iconBtn;
}

class Menu extends React.Component<PropsType, StatesType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isRecorder: true,
      isPlayer: false,
      isSetting: false,
    };
    (this: any).selectMenu = this.selectMenu.bind(this);
  }

  selectMenu(menuName: string) {
    const { history } = this.props;
    switch (menuName) {
      case 'recorder':
        history.push(getRootHtmlPath());
        this.setState({
          isRecorder: true,
          isPlayer: false,
          isSetting: false,
        });
        break;
      case 'player':
        history.push('/player');
        this.setState({
          isRecorder: false,
          isPlayer: true,
          isSetting: false,
        });
        break;
      case 'setting':
        history.push('/setting');
        this.setState({
          isRecorder: false,
          isPlayer: false,
          isSetting: true,
        });
        break;
      default:
        history.push(getRootHtmlPath());
        this.setState({
          isRecorder: true,
          isPlayer: false,
          isSetting: false,
        });
        break;
    }
  }

  render(): React.Node {
    const { isRecorder, isPlayer, isSetting } = this.state;
    return (
      <div id={styles.itemWrapper}>
        <div className={styles.item}>
          <IconButton
            className={isSelected(isRecorder)}
            color="secondary"
            onClick={() => { this.selectMenu('recorder'); }}
          >
            <VideoCam />
            <div className={styles.title}>録画</div>
          </IconButton>
        </div>

        <div className={styles.blank} />

        <div className={styles.item}>
          <IconButton
            className={isSelected(isPlayer)}
            color="secondary"
            onClick={() => { this.selectMenu('player'); }}
          >
            <VideoLibrary />
            <div className={styles.title}>再生</div>
          </IconButton>
        </div>

        <div className={styles.blank} />

        <div className={styles.item}>
          <IconButton
            className={isSelected(isSetting)}
            color="secondary"
            onClick={() => { this.selectMenu('setting'); }}
          >
            <Build />
            <div className={styles.title}>設定</div>
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withRouter(Menu);
