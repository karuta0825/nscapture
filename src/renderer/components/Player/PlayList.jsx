import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Autorenew from 'material-ui-icons/Autorenew';
import moment from 'moment';
import styles from './css/PlayList.css';

export default class PlayList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classs, files, refreshList, selectVideo, selectedItemNum } = this.props;
    return (
      <div className={styles[classs]}>
        <div className={styles.header}>
          <div className={styles.header__title}>
            <Typography variant='body2'>動画一覧</Typography>
          </div>
          <IconButton className={styles.header__icon_update} color="primary" component="span" onClick={refreshList}>
            <Autorenew style={{ fontSize: 20 }} />
          </IconButton>
        </div>
        <div className={styles.body}>
          {
            files.map((v,k) => (
              <div className={ (k === selectedItemNum) ? styles.item_selected : styles.item} onClick={() => selectVideo(k)}>
                <Typography variant='body2'>
                  <div className={styles.item__date}>{moment(v.mtime).format('YYYY年MM月DD日')}</div>
                  <div className={styles.item__name}>{v.name}</div>
                  <div className={styles.item__size}>{Math.floor( v.size/1000000 * Math.pow(10, 1) ) / Math.pow(10, 1) + 'MB'}</div>
                </Typography>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
