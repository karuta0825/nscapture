import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import {sizeList} from '../../constants/Window';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    marginLeft: 80,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class RadioButtonsGroup extends Component {
  constructor(props){
    super(props);
    const defaultSize = localStorage.getItem('size');
    this.state = {
      value: defaultSize || sizeList.HD.join('x'),
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    localStorage.setItem('size', event.target.value);
    this.setState({ value: event.target.value });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" required className={classes.formControl}>
          <RadioGroup
            aria-label="size"
            name="size"
            className={classes.group}
            value={this.state.value}
            onChange={this.handleChange}
          >
          {
            Object.keys(sizeList).map((v,k) => {
              const value = sizeList[v].join('x');
              return <FormControlLabel value={value} control={<Radio color='primary' />} label={value} />
            })
          }
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

RadioButtonsGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioButtonsGroup);
