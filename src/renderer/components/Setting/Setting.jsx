// @flow
import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from 'material-ui/List';
import Switch from 'material-ui/Switch';
import AspectRatio from '@material-ui/icons/AspectRatio';
import Mic from '@material-ui/icons/Mic';
import FileDownload from '@material-ui/icons/FileDownload';
import FolderOpen from '@material-ui/icons/FolderOpen';
import { ipcRenderer as ipc } from 'electron';
import SizeSelect from './SizeSelect';
import { getOS } from '../../../utils/Path';

const styles = theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

type PropsType = {
  classes: string
};

type StatesType = {
  checked: boolean,
  savePath: string | null
};

class Setting extends React.Component<PropsType, StatesType> {
  constructor(props) {
    super(props);
    const savePath = localStorage.getItem('savePath');
    const hasAudio = (localStorage.getItem('hasAudio') === 'true');
    this.state = {
      checked: hasAudio,
      savePath: (savePath !== 'null') ? savePath : '保存先: 未設定',
    };
    this.handleToggle = this.handleToggle.bind(this);

    ipc.on('select-folder', (e, path) => {
      if (path === '未設定') {
        localStorage.setItem('savePath', null);
      } else {
        localStorage.setItem('savePath', path);
      }
      this.setState({ savePath: `保存先: ${path}` });
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners('select-folder');
  }

  handleToggle() {
    const { checked } = this.state;
    localStorage.setItem('hasAudio', !checked);
    this.setState({ checked: !checked });
  }

  selectFolder() {
    ipc.send('open-folder');
  }

  showMic(): React.Node | null {
    const os = getOS();
    if (os !== 'win32') { return null; }
    return (
      <ListItem>
        <ListItemIcon>
          <Mic />
        </ListItemIcon>
        <ListItemText primary="録音" />
        <ListItemSecondaryAction>
          <Switch
            onChange={() => { this.handleToggle(); }}
            checked={this.state.checked}
            color="primary"
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  render(): React.Node {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <List subheader={<ListSubheader>デフォルト設定</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <AspectRatio />
            </ListItemIcon>
            <ListItemText primary="解像度" />
          </ListItem>
          <SizeSelect />
          { this.showMic() }
          <ListItem>
            <ListItemIcon>
              <FileDownload />
            </ListItemIcon>
            <ListItemText primary={this.state.savePath} />
            <ListItemSecondaryAction>
              <IconButton color="primary" onClick={this.selectFolder}>
                <FolderOpen />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(Setting);
