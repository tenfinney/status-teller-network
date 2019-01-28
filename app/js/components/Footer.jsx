import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';

const Footer = (props) => (
  <footer>
    {<Button onClick={props.previous} className="previous-btn" color="link">&lt; Previous</Button>}
    {props.next && <Button onClick={props.next} className="next-btn" color="link">Next &gt;</Button>}
  </footer>
);

Footer.propTypes = {
  previous: PropTypes.func,
  next: PropTypes.func
};

export default Footer;
