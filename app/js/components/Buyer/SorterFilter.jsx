import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faSortAmountDown} from "@fortawesome/free-solid-svg-icons";
import classnames from 'classnames';

import './SorterFilter.scss';
import CheckButton from '../ui/CheckButton';
import {ButtonGroup, FormGroup} from "reactstrap";
import {Typeahead} from "react-bootstrap-typeahead";

const FilterMenu = ({open, close}) => (
  <Fragment>
    <div className={classnames({"filter-menu-backdrop": true, "open": open})} onClick={close}/>
    <div className={classnames({"filter-menu": true, "open": open})}>
      <h4>Sort and filter</h4>

      <h5 className="mt-4">Sort</h5>
      <ButtonGroup vertical className="w-100">
        <CheckButton active={true}>
          Top rated
        </CheckButton>
        <CheckButton active={false}>
          Most recent
        </CheckButton>
      </ButtonGroup>

      <h5 className="mt-4">Payment method</h5>
      <ButtonGroup vertical className="w-100">
        <CheckButton active={true}>
          Cash in person
        </CheckButton>
        <CheckButton active={false}>
          Card transfer
        </CheckButton>
      </ButtonGroup>

      <h5 className="mt-4">Country</h5>
      <FormGroup>
        <Typeahead
          options={['Canada', 'USA', 'France']}
          placeholder={'Select'}
        />
      </FormGroup>

      <h5 className="mt-4">Asset</h5>
      <FormGroup>
        <Typeahead
          options={['ETH', 'DAI', 'SNT']}
          placeholder={'Select'}
        />
      </FormGroup>
    </div>
  </Fragment>
);

FilterMenu.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func
};

class SorterFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  toggleMenu = () => {
    this.setState({open: !this.state.open});
  };

  render() {
    return (<Fragment>
      <FilterMenu open={this.state.open} close={this.toggleMenu}/>
      <div className="sorter-select font-weight-bold px-3 py-2 bg-secondary rounded v-align-center my-3"
           onClick={this.toggleMenu}>
        <span className="sort-icon bg-dark text-white rounded-circle d-inline-block text-center p-2 mr-2">
          <FontAwesomeIcon icon={faSortAmountDown}/>
        </span> Sort and filter <span className="float-right pt-1"><FontAwesomeIcon size="2x"
                                                                                    icon={faAngleDown}/></span>
      </div>
    </Fragment>);
  }
}

SorterFilter.propTypes = {
  onChange: PropTypes.func
};

export default SorterFilter;