import React from 'react';
import {Row, Col} from 'reactstrap';
import PropTypes from 'prop-types';
import Identicon from "../../../components/UserInformation/Identicon";

const ContactUser = ({username, seed, statusContactCode}) => (
  <a href={"https://get.status.im/user/" + statusContactCode} rel="noopener noreferrer" target="_blank">
    <Row className="mt-4 gutterBottom">
      <Col xs="2">
        <div className="rounded-icon rounded-circle rounded-icon__blue">
          <Identicon seed={seed} className="rounded-circle border" scale={5}/>
        </div>
      </Col>
      <Col xs="10" className="my-auto">
        <h6 className="m-0">Contact {username}</h6>
      </Col>
    </Row>
  </a>
);

ContactUser.propTypes = {
  username: PropTypes.string,
  seed: PropTypes.string,
  statusContactCode: PropTypes.statusContactCode
};

export default ContactUser;
