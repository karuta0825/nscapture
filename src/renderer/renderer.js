import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Manager from './Manager';


export default class App extends Component {

  render() {
    return (
      <MuiThemeProvider>
        <Manager />
      </MuiThemeProvider>
    )
  }
}

ReactDom.render(
  <App />,
  document.getElementById('root')
);
