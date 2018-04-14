import React, { Component } from 'react';
import styles from '../css/app.css';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import { ListItem, ListItemText } from 'material-ui/List';

export default class Thumbnails extends Component {

  render() {
    const {imgs, selectThumbnail} = this.props
    return (
      <div id={styles.thumbnails}>
        <List component="nave">
        {
          imgs.map((item,idx) => {
            return (
              <ListItem className={styles.thumbnails__item} button onClick={() => { selectThumbnail(item)}}>
                <img className={styles.thumbnails__item__img} src={item.thumbnail.toDataURL()} />
                <div className={styles.thumbnails__item__name}>
                  <Typography variant='body2'>{item.name}</Typography>
                </div>
              </ListItem>
            )
          })
        }
        </List>
      </div>
    );
  }

}