import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Autorenew from 'material-ui-icons/Autorenew';
import styles from './css/PlayList.css';


export default class PlayList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
    this.refreshList = this.refreshList.bind(this);
  }

  refreshList() {
    console.log('refreshed');
  }

  selectVideo() {

  }

  render() {
    const { classs } = this.props;
    const { list } = this.state;
    return (
      <div className={styles[classs]}>
        <div className={styles.header}>
          <div className={styles.header__title}>
          </div>
          <IconButton className={styles.header__icon_update} color="primary" component="span" onClick={this.refreshList}>
            <Autorenew style={{ fontSize: 20 }} />
          </IconButton>
        </div>
        <div className={styles.body}>
          {
            list.map(v => (
              <div>
                <div>image</div>
                <div>{v.name}</div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
