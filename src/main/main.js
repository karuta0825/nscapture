// アプリケーション作成用のモジュールを読み込み
import { app, BrowserWindow, ipcMain as ipc, dialog } from 'electron';
import {getRoot} from '../utils/Path'

const ROOT_PATH = "file://" + getRoot();

// メインウィンドウ
let mainWindow;

//  初期化が完了した時の処理
app.on('ready', () => {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({width: 780, height: 520});
  mainWindow.loadURL(`${ROOT_PATH}/dist/renderer/index.html`);

  ipc.on('save-dialog', (e, path) => {

    const options = {
      title: '動画保存',
      defaultPath: path,
      filters: [
        { name: '動画', extensions: ['webm']},
      ],
      properties: ['openFile', 'createDirectory']
    };

    dialog.showSaveDialog(options, (filename) => {
      e.sender.send('saved-file', filename);
    });
  });

  ipc.on('select-file', (e) => {

    const options = {
      title: '動画選択',
      filters: [
        { name: '動画', extensions: ['webm', 'mp4']}
      ],
      properties: ['openFile'],
    };

    dialog.showOpenDialog(options, (files) => {
      const filePath = (files) ? files[0] : null;
      e.sender.send('select-file', filePath);
    });

  });

  ipc.on('open-folder', (e) => {
    const options = {
      title: '保存先',
      properties: ['openDirectory','createDirectory']
    };

    dialog.showOpenDialog(options, (directoryPaths) => {
      const path = directoryPaths ? directoryPaths[0] : '未設定'
      e.sender.send('select-folder', path);
    });
  })

  // デベロッパーツールの起動
  mainWindow.webContents.openDevTools();

  // mainWindow.setMenu(null);
  BrowserWindow.addDevToolsExtension(
    '/Users/takayuki/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.2.4_0'
  );


 // メインウィンドウが閉じられたときの処理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

});

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  // macOSのとき以外はアプリケーションを終了させます
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  // メインウィンドウが消えている場合は再度メインウィンドウを作成する
  if (mainWindow === null) {
    createWindow();
  }
});
