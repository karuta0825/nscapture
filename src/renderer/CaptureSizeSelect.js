import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

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
    this.state = {
      size : 1280720
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <Select
            value={this.state.size}
            onChange={this.handleChange}
            inputProps={{
              name: 'size',
            }}
          >
            <MenuItem value={1280720}>1280×720</MenuItem>
            <MenuItem value={720540}>720×540</MenuItem>
            <MenuItem value={320200}>320×200</MenuItem>
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
