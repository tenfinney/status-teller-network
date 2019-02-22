import React, {Component} from 'react';
import {HashRouter, Route, Redirect, Switch} from "react-router-dom";
import {connect} from 'react-redux';
import {Container} from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Wizard from '../components/Wizard';
import Header from "../components/Header";
import Loading from "../components/ui/Loading";
import ErrorInformation from '../components/ui/ErrorInformation';

import HomeContainer from '../containers/HomeContainer';
import ProfileContainer from '../containers/ProfileContainer';
import EditProfileContainer from '../containers/EditProfileContainer';
import LicenseContainer from '../containers/LicenseContainer';

// Buyer
import OfferListContainer from '../containers/Buyer/OfferListContainer';
import BankOfferListContainer from '../containers/Buyer/BankOfferListContainer';
import MapContainer from '../containers/Buyer/MapContainer';
import SellerProfileContainer from '../containers/Buyer/SellerProfileContainer';
import OfferTradeContainer from '../containers/Buyer/OfferTradeContainer';
import BuyerContactContainer from '../containers/Buyer/BuyerContactContainer';

// Seller
import SellerAssetContainer from '../containers/Seller/0_SellerAssetContainer';
import SellerLocationContainer from '../containers/Seller/1_SellerLocationContainer';
import SellerPaymentMethodsContainer from '../containers/Seller/2_SellerPaymentMethodsContainer';
import SellerCurrencyContainer from '../containers/Seller/3_SellerCurrencyContainer';
import SellerMarginContainer from '../containers/Seller/4_SellerMarginContainer';
import SellerContactContainer from '../containers/Seller/5_SellerContactContainer';

// Tmp
import EscrowsContainer from '../containers/tmp/EscrowsContainer';
import PriceContainer from '../containers/tmp/PriceContainer';
import SignatureContainer from '../containers/tmp/SignatureContainer';
import ArbitrationContainer from '../containers/tmp/ArbitrationContainer';

import prices from '../features/prices';
import network from '../features/network';
import metadata from '../features/metadata';
import license from "../features/license";

const PRICE_FETCH_INTERVAL = 60000;

class App extends Component {
  constructor(props) {
    super(props);
    this.props.init();
    setInterval(() => {
      this.props.fetchExchangeRates();
    }, PRICE_FETCH_INTERVAL);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isReady && this.props.isReady) {
      this.props.loadProfile(this.props.address);
      this.props.checkLicenseOwner();
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.isReady !== this.props.isReady ||
      !_.isEqual(nextProps.profile, this.props.profile) ||
      nextProps.error !== this.props.error ||
      nextProps.hasToken !== this.props.hasToken ||
      nextProps.isLicenseOwner !== this.props.isLicenseOwner;
  }

  render() {
    if (!this.props.isReady) {
      return <Loading initial/>;
    }

    if (this.props.error) {
      return <ErrorInformation provider/>;
    }

    if (!this.props.hasToken) {
      return <ErrorInformation network/>;
    }

    return (
      <HashRouter>
        <Container>
          <Header profile={this.props.profile}/>
          <Switch>
            <Route exact path="/" component={HomeContainer}/>
            <Route exact path="/profile" component={ProfileContainer}/>
            <Route exact path="/profile/edit" component={EditProfileContainer}/>
            <Route exact path="/license" component={LicenseContainer}/>

            <Route exact path="/buy" component={OfferListContainer}/>
            <Route exact path="/buy/map" component={MapContainer}/>
            <Route exact path="/buy/list" component={BankOfferListContainer}/>
            <Route exact path="/buy/profile/:address" component={SellerProfileContainer}/>
            <Wizard path="/buy/offer" steps={[
              {path: '/buy/offer/contact', component: BuyerContactContainer},
              {path: '/buy/offer/trade', component: OfferTradeContainer}
            ]}/>

            {this.props.isLicenseOwner &&
              <Wizard path="/sell/" steps={[
                {path: '/sell/asset', component: SellerAssetContainer},
                {path: '/sell/location', component: SellerLocationContainer},
                {path: '/sell/payment-methods', component: SellerPaymentMethodsContainer},
                {path: '/sell/currency', component: SellerCurrencyContainer},
                {path: '/sell/margin', component: SellerMarginContainer, nextLabel: 'Confirm price'},
                {path: '/sell/contact', component: SellerContactContainer, nextLabel: 'Post the offer'}
              ]}/>
            }

            <Route path="/tmp/price" component={PriceContainer}/>
            <Route path="/tmp/escrows" component={EscrowsContainer}/>
            <Route path="/tmp/map" component={MapContainer}/>
            <Route path="/tmp/signature" component={SignatureContainer}/>
            <Route path="/tmp/arbitration" component={ArbitrationContainer}/>

            <Redirect to="/"/>
          </Switch>
        </Container>
      </HashRouter>
    );
  }
}

const mapStateToProps = (state) => {
  const address = network.selectors.getAddress(state) || '';
  return {
    address,
    isLicenseOwner: license.selectors.isLicenseOwner(state),
    isReady: network.selectors.isReady(state),
    hasToken: Object.keys(network.selectors.getTokens(state)).length > 0,
    error: network.selectors.getError(state),
    profile: metadata.selectors.getProfile(state, address)
  };
};

App.propTypes = {
  init: PropTypes.func,
  error: PropTypes.string,
  fetchPrices: PropTypes.func,
  fetchExchangeRates: PropTypes.func,
  isReady: PropTypes.bool,
  hasToken: PropTypes.bool,
  address: PropTypes.string,
  profile: PropTypes.object,
  loadProfile: PropTypes.func,
  checkLicenseOwner: PropTypes.func,
  isLicenseOwner: PropTypes.bool
};

export default connect(
  mapStateToProps,
  {
    fetchPrices: prices.actions.fetchPrices,
    fetchExchangeRates: prices.actions.fetchExchangeRates,
    init: network.actions.init,
    loadProfile: metadata.actions.load,
    checkLicenseOwner: license.actions.checkLicenseOwner
  }
)(App);
