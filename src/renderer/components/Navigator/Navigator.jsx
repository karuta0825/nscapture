// @flow
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styles from './css/Navigator.css';
import Recorder from '../Recorder/Recorder';
import Player from '../Player/Player';
import Setting from '../Setting/Setting';
import Menu from './Menu';
import { getRootHtmlPath } from '../../../utils/Path';

export default function Navigator(): React.Node {
  return (
    <Router >
      <div
        id={styles.wrapper}
        onDragOver={e => e.preventDefault()}
        onDrop={e => e.preventDefault()}
      >
        <Menu />
        <Switch>
          <Route exact path={getRootHtmlPath()} component={Recorder} />
          <Route path="/player" component={Player} />
          <Route path="/setting" component={Setting} />
        </Switch>
      </div>
    </Router>
  );
}
