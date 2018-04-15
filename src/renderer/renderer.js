import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Manager from './Manager';
import {theme} from '../assets/theme'

export default class App extends Component {

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Manager />
      </MuiThemeProvider>
    )
  }
}

ReactDom.render(
  <App />,
  document.getElementById('root')
);
