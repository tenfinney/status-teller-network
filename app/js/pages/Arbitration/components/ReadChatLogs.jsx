import React from 'react';
import {Row, Col} from 'reactstrap';

const ReadChatLogs = () => (
  <Row className="mt-4">
    <Col xs="2">
      <div className="rounded-icon rounded-circle rounded-icon__blue">
        <img src="images/read-chat.png" className="rounded-icon--icon" height="20" width="20" />
      </div>
    </Col>
    <Col xs="10 my-auto">
      <h6 className="m-0">Read chat logs of this trade</h6>
    </Col>
  </Row>
);

export default ReadChatLogs;