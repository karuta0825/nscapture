### アプリ名
NsCapture

#### 概要
electronで作ったキャプチャーソフトです。  
Reactの勉強を兼ねて、Material-UIやflowを取り入れて作成しました。

![デモイメージ](https://user-images.githubusercontent.com/9998881/45593820-6c386380-b9c9-11e8-8511-5300c461ca6d.gif)

#### 動作環境
 [x] Windows  
 [x] Mac(音声録音不可)  
 [-] Linux(未検証だが多分Macと同様の性能)  

#### 起動方法
1. git cloneでソース取得

2. 起動
  electronをグローバルインストールしている場合
 `npm install`後、`npm start`で起動させることができます。

  electronをグローバルインストールしていない場合
 `npm i -g electron`あるいは`npm i electron`の実行も必要となります。

#### できること
- 録画・録音(Windowsのみ可)
- キャプチャーしたいスクリーンあるいはウィンドウ選択
- キャプチャーサイズ設定
- 動画保存先の設定
- 録画・録音した映像の再生
- 設定画面によりデフォルト設定

#### 今後の課題
- 勉強のためRedux導入
- デフォルト名で動画保存後、ダイアログを起動するように変更
- タスクトレイから起動・終了
- ショートカットキーによる録画を可能にする
