'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function Thread (props) {
  const { _id, title = _id, actions } = props;
  return (<li><Link to={`/messenger/${_id}`} >{title}</Link><button type="button" style={{float:'right'}} onClick={() => actions.deleteThread(_id)}>Delete</button></li>);
}

export default function Threads (props) {
  const { threads, actions } = props;
  return (<div className="messenger-threads">
    <header>
      <button type="button" onClick={event => event}>Messages</button>
      <button type="button" onClick={event => event}>Invitations</button>
      <button type="button" onClick={event => event}>Promotions</button>
      <button type="button" onClick={event => event}>Chat</button>
    </header>
    <ul>{threads.map(thread => <Thread key={thread._id} actions={actions} {...thread} />)}</ul>
    <footer>
      <button type="button" onClick={event => actions.fetchThreads()}>Fetch Threads</button>
      <button type="button" onClick={event => actions.joinThread()}>Join Thread</button>
    </footer>
  </div>);
}

Threads.propTypes = {
  threads: PropTypes.array,
};
