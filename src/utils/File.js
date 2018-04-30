import fs from 'fs';

/**
 * unix ls command
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
export function ls(path) {
  return new Promise((res, rej) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        rej(err);
      }
      res(files);
    });
  });
}

export function getStatus(path) {
  return new Promise((res, rej) => {
    fs.stat(path, function (err, stats) {
      if (err) {rej(err);}
      res(stats)
    });
  });
}

export async function filterVideoFile(path) {
  const files = await ls(path);
  const list = [];

  if (files.length < 1) { return list; }

  for (let i = 0; i < files.length; i += 1) {
    const pathAndExt = files[i].split(/\.(?=[^.]+$)/);
    if (pathAndExt[1] === 'webm' || pathAndExt[1] === 'mp4') {
      const fileInfo = await getStatus(`${path}/${files[i]}`)
      const file = Object.assign({}, fileInfo, {name: files[i]});
      list.push(file);
    }
  }
  return list;
}


