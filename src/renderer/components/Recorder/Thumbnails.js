import React, { Component } from 'react';
import styles from '../../../css/app.css';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Autorenew from 'material-ui-icons/Autorenew';

export default class Thumbnails extends Component {

  render() {
    const {imgs, selectThumbnail, refreshWindow} = this.props
    return (
      <div id={styles.capture_list}>
        <div className={styles.capture_list__header}>
          <div>
            <Typography variant='body2'>ウィンドウ一覧</Typography>
          </div>
          <IconButton className={styles.header__icon_update} color="primary" component="span" onClick={refreshWindow}>
            <Autorenew style={{ fontSize: 20 }}/>
          </IconButton>
        </div>
        <div id={styles.thumbnails}>
          {
            imgs.map((item,idx) => {
              return (
                <div className={styles.thumbnails__item} onClick={() => { selectThumbnail(item)}}>
                  <img className={styles.thumbnails__item__img} src={item.thumbnail.toDataURL()} />
                  <div className={styles.thumbnails__item__name}>
                    <Typography variant='body2'>{item.name}</Typography>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}