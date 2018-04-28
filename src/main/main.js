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

  ipc.on('save-dialog', (e) => {

    const options = {
      title: '動画保存',
      filters: [
        { name: 'ドキュメント', extensions: ['webm']},
      ],
      properties: ['openFile', 'createDirectory']
    };

    dialog.showSaveDialog(options, (filename) => {
      e.sender.send('saved-file', filename);
    });
  });

  // デベロッパーツールの起動
  mainWindow.webContents.openDevTools();

  // mainWindow.setMenu(null);

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
