'use strict';

import React, { PropTypes } from 'react';

import Messages from './Messages';

export default function Composer(props) {
  const { messages, events, typing, party, thread, composer, actions } = props;
  return (<div className="messages">
    <Messages messages={messages} events={events} typing={typing} party={party} thread={thread} actions={actions} />
    <hr />
    <section className="composer">
      <header>
      </header>
      <textarea id="message"
        value={composer.message}
        onFocus={event => composer.isTyping(thread._id, true)}
        onBlur={event => composer.isTyping(thread._id, false)}
        onChange={({ target }) => composer.onChange(target.value)} />
      <footer>
        <button type="button" onClick={composer.sendMessage}
          disabled={composer.message.length ? false : true}>Reply</button>
      </footer>
    </section>
  </div>);
}
