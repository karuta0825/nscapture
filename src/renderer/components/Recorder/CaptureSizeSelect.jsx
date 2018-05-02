import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import {sizeList} from '../../constants/Window';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class CaptureSizeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { changeSize } = this.props;
    const [width, height] = event.target.value.split('x');
    changeSize(width, height);
  }

  render() {
    const { classes, size } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <Select
            value={size}
            onChange={this.handleChange}
          >
          {
            Object.keys(sizeList).map((v,k) => {
              const value = sizeList[v].join('x');
              return <MenuItem value={value}>{value}</MenuItem>
            })
          }
          </Select>
        </FormControl>
      </form>
    );
  }
}

CaptureSizeSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CaptureSizeSelect);
