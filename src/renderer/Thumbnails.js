import React, { Component } from 'react';
import styles from '../css/app.css';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';

export default class Thumbnails extends Component {

  setCharlength(windowName) {
    if (windowName.length > 30) {
      return windowName.substr(0,30)
    }
    return windowName;
  }

  render() {
    const {imgs, selectThumbnail} = this.props
    return (
      <div id={styles.thumbnails}>
        <ul style={{padding:0}}>
          {
            imgs.map((item,idx) => {
              return (
                <Paper className={styles.thumbnails__item} elevation={1} onClick={() => { selectThumbnail(item)}}>
                  <img className={styles.thumbnails__item__img} src={item.thumbnail.toDataURL()} />
                  <div className={styles.thumbnails__item__name}>
                    <Typography variant='body2'>{this.setCharlength(item.name)}</Typography>
                  </div>                
                </Paper>
              );
            })
          }
        </ul>
      </div>
    );
  }

  // render() {
  //   const {imgs, selectThumbnail} = this.props
  //   return (
  //     <div id={styles.thumbnails}>
  //       <List component="nave">
  //       {
  //         imgs.map((item,idx) => {
  //           return (
  //             <ListItem className={styles.thumbnails__item} button onClick={() => { selectThumbnail(item)}}>
  //               <div className={styles.thumbnails__item__imgBox}>
  //                 <img className={styles.thumbnails__item__img} src={item.thumbnail.toDataURL()} />
  //               </div>
  //               <div className={styles.thumbnails__item__name}>
  //                 <Typography variant='body2'>{this.setCharlength(item.name)}</Typography>
  //               </div>
  //             </ListItem>
  //           )
  //         })
  //       }
  //       </List>
  //     </div>
  //   );
  // }

}