import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Autorenew from 'material-ui-icons/Autorenew';
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
                <div className={styles.item__name}>{v.name}</div>
                <div className={styles.item__date}>{v.birthday}</div>
                <div className={styles.item__size}>{v.size}</div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
