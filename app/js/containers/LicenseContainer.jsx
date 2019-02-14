import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import license from "../features/license";
import balances from "../features/balances";
import embarkjs from "../features/embarkjs";

import LicenseInfo from '../components/License/LicenseInfo';
import LicenseBuy from '../components/License/LicenseBuy';
import Loading from '../components/ui/Loading';
import YourSNTBalance from '../components/YourSNTBalance';

class LicenseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { buying: false };
  }

  componentDidMount() {
    this.props.loadSNTBalance(this.props.address);
    this.props.checkLicenseOwner();
  }

  componentDidUpdate() {
    if (this.props.isLicenseOwner) {
      this.setState({buying: false})
      return this.props.history.push('/sell');
    }
  }

  buyLicense = () => {
    this.setState({buying: true});
    this.props.buyLicense();
  };

  render() {
    if (this.state.buying) {
      return <Loading mining/>;
    }

    return (
      <React.Fragment>
        <LicenseInfo />
        <YourSNTBalance value={this.props.sntBalance}/>
        <LicenseBuy onClick={this.buyLicense} disabled={this.props.sntBalance === 0}/>
      </React.Fragment>
    );
  }
}

LicenseContainer.propTypes = {
  history: PropTypes.object,
  address: PropTypes.string,
  wizard: PropTypes.object,
  checkLicenseOwner: PropTypes.func,
  buyLicense: PropTypes.func,
  isLicenseOwner: PropTypes.bool,
  loadSNTBalance: PropTypes.func,
  sntBalance: PropTypes.number
};

const mapStateToProps = state => {
  const address = embarkjs.selectors.getAddress(state) || '';
  return {
    address,
    isLicenseOwner: license.selectors.isLicenseOwner(state),
    sntBalance: balances.selectors.getSNTBalance(state, address)
  };
};

export default connect(
  mapStateToProps,
  {
    loadSNTBalance: balances.actions.loadSNTBalance,
    buyLicense: license.actions.buyLicense,
    checkLicenseOwner: license.actions.checkLicenseOwner
  }
)(withRouter(LicenseContainer));
