import * as React from 'react';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Autorenew from 'material-ui-icons/Autorenew';
import styles from './css/Thumbnails.css';

export type ImgType = {
  id: string,
  name: string,
  thumbnail: Image,
};

type PropsType = {
  imgs: Array<ImgType>,
  selectThumbnail: (item: ImgType, order: number) => void,
  refreshWindow: () => void,
  selectedNum: number,
};

export default function Thumbnails(props: PropsType): React.Node {
  const {
    imgs,
    selectThumbnail,
    refreshWindow,
    selectedNum,
  } = props;

  return (
    <div id={styles.list}>
      <div className={styles.header}>
        <div className={styles.header__title}>
          <Typography variant="body2">ウィンドウ一覧</Typography>
        </div>
        <IconButton className={styles.header__icon_update} color="primary" component="span" onClick={refreshWindow}>
          <Autorenew style={{ fontSize: 20 }} />
        </IconButton>
      </div>
      <div id={styles.thumbnailsWrapper}>
        {
          imgs.map((item: ImgType, idx: number) => (
            <div
              className={(selectedNum === idx) ? styles.item_selected : styles.item}
              onClick={() => { selectThumbnail(item, idx); }}
              role="presentation"
            >
              <img
                className={styles.item__img}
                src={item.thumbnail.toDataURL()}
                alt="キャプチャーサムネイル"
              />
              <div className={styles.item__name}>
                <Typography variant="body2">{item.name}</Typography>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
