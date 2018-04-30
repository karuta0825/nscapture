import React, { Component } from 'react';
import ReactDom from 'react-dom';
import sytles from '../css/app.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navigator from './components/Navigator/Navigator';
import { BrowserRouter as Router } from 'react-router-dom'

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Navigator />
      </MuiThemeProvider>
    )
  }
}

ReactDom.render(
  <App />,
  document.getElementById('root')
);
