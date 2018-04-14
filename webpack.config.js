const webpack = require('webpack');
const path = require('path');

const config = [
  {
    // render
    entry: './src/main/main.js',
    output: {
      path: path.resolve(__dirname, 'dist/main'),
      filename: 'main.js'
    },
    devtool: 'source-map',
    target: 'electron-main',
    module: {
      rules:[
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
      ]
    }
  },
  {
    // renderer
    entry: './src/renderer/renderer.js',
    output: {
      path: path.resolve(__dirname, 'dist/renderer'),
      filename: 'renderer.js'
    },
    target: 'electron-renderer',
    devtool: 'source-map',
    module: {
      rules:[
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins:['transform-class-properties']
        },
      },
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: ['style-loader', 'css-loader?modules']
      }
      ]
    }
  }
]


module.exports = config;