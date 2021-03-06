import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import newSeller from "../../../features/newSeller";
import arbitration from "../../../features/arbitration";
import network from "../../../features/network";
import metadata from "../../../features/metadata";
import ArbitratorSelectorForm from "./components/ArbitratorSelectorForm";
import {addressCompare} from '../../../utils/address';

class SelectArbitrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArbitrator: props.seller.arbitrator
    };
    this.loadedUsers = [];

    props.getArbitrators();

    this.validate(props.seller.arbitrator);

    props.footer.onPageChange(() => {
      props.setArbitrator(this.state.selectedArbitrator);
    });
  }

  componentDidUpdate(prevProps) {
    if ((!prevProps.arbitrators && this.props.arbitrators) || prevProps.arbitrators.length !== this.props.arbitrators.length || Object.keys(this.props.users).length !== this.props.arbitrators.length) {
      this.props.arbitrators.forEach(arbitratorAddr => {
        if (!this.props.users[arbitratorAddr] && !this.loadedUsers.includes(arbitratorAddr)) {
          this.props.getUser(arbitratorAddr);
          this.loadedUsers.push(arbitratorAddr);
        }
      });
    }
  }

  componentDidMount() {
    if (!this.props.seller.paymentMethods.length) {
      return this.props.wizard.previous();
    }
    this.setState({ready: true});
  }

  validate(selectedArbitrator) {
    if (selectedArbitrator) {
      return this.props.footer.enableNext();
    }
    this.props.footer.disableNext();
  }

  changeArbitrator = (selectedArbitrator) => {
    if (!selectedArbitrator) {
      selectedArbitrator = '';
    }
    this.validate(selectedArbitrator);
    this.setState({selectedArbitrator});
  };

  render() {
    return (
      <ArbitratorSelectorForm
        value={this.state.selectedArbitrator}
        arbitrators={this.props.arbitrators.filter(x => !addressCompare(x, this.props.address))}
        changeArbitrator={this.changeArbitrator} users={this.props.users}
      />);
  }
}

SelectArbitrator.propTypes = {
  wizard: PropTypes.object,
  footer: PropTypes.object,
  seller: PropTypes.object,
  address: PropTypes.string,
  arbitrators: PropTypes.array,
  users: PropTypes.object,
  setArbitrator: PropTypes.func,
  getArbitrators: PropTypes.func,
  getUser: PropTypes.func
};

const mapStateToProps = state => ({
  address: network.selectors.getAddress(state) || '',
  seller: newSeller.selectors.getNewSeller(state),
  arbitrators: arbitration.selectors.arbitrators(state),
  users: metadata.selectors.getAllUsers(state)
});

export default connect(
  mapStateToProps,
  {
    setArbitrator: newSeller.actions.setArbitrator,
    getArbitrators: arbitration.actions.getArbitrators,
    getUser: metadata.actions.loadUserOnly
  }
)(SelectArbitrator);
