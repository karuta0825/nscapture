const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const electron = require('electron-connect').server.create();

// main用とrenderer用の設定ファイルを格納
const [mainConfig, rendererConfig] = require('./webpack.config');

// main用のコンパイルタスクを定義
gulp.task('main', () => (
  webpackStream(mainConfig, webpack)
    .pipe(gulp.dest('./dist/main'))
));

// renderer用のコンパイルタスクを定義
gulp.task('renderer', () => (
  webpackStream(rendererConfig, webpack)
    .pipe(gulp.dest('./dist/renderer'))
));

//  gulp起動時のタスクを定義
gulp.task('default', ['main', 'renderer'], () => {
  // electron開始
  electron.start();

  // main.jsファイルが変更されたら再コンパイル
  gulp.watch('src/main/*.{js,jsx}', ['main']);

  // rendererフォルダ配下のファイルが変更されたら、renderer用のコンパイルを実行
  gulp.watch('src/{renderer,utils}/**/*.{js,jsx}', ['renderer']);

  // mainのコンパイルを終了すると,electronをRestart。
  gulp.watch('dist/main/main.js', electron.restart);

  // rendererコンパイルが終了するとReload。
  gulp.watch('dist/renderer/*.{html,js,css}', electron.reload);
});
