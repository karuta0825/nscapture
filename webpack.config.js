// const webpack = require('webpack');
const path = require('path');

const config = [
  {
    // render
    mode: 'production',
    entry: './src/main/main.js',
    output: {
      path: path.resolve(__dirname, 'dist/main'),
      filename: 'main.js',
    },
    devtool: 'source-map',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      }],
    },
  },
  {
    // renderer
    mode: 'production',
    entry: './src/renderer/renderer.js',
    output: {
      path: path.resolve(__dirname, 'dist/renderer'),
      filename: 'renderer.js',
    },
    target: 'electron-renderer',
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-class-properties'],
        },
      },
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: ['style-loader', 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]'],
      }],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  },
];


module.exports = config;
