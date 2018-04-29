import React, { Component } from 'react';
import styles from './css/Thumbnails.css';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Autorenew from 'material-ui-icons/Autorenew';

export default class Thumbnails extends Component {

  render() {
    const {imgs, selectThumbnail, refreshWindow} = this.props
    return (
      <div id={styles.list}>
        <div className={styles.header}>
          <div className={styles.header__title}>
            <Typography variant='body2'>ウィンドウ一覧</Typography>
          </div>
          <IconButton className={styles.header__icon_update} color="primary" component="span" onClick={refreshWindow}>
            <Autorenew style={{ fontSize: 20 }}/>
          </IconButton>
        </div>
        <div id={styles.thumbnailsWrapper}>
          {
            imgs.map((item,idx) => {
              return (
                <div className={styles.item} onClick={() => { selectThumbnail(item)}}>
                  <img className={styles.item__img} src={item.thumbnail.toDataURL()} />
                  <div className={styles.item__name}>
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