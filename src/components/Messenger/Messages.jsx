import React, { PropTypes } from 'react';

function Message (props) {
  const { _id, uid, thread, message, edited = false, updatedAt, createdAt, actions } = props;

  return (<li className="message-item">
    <article>
      <header>
        {/* <p>_id: {_id}, uid: {uid}</p> */}
      </header>
      <p>{message}</p>
      <footer>
        <span>
          <small>Published: <time dateTime={createdAt}>{createdAt}</time></small>
          <small>{`${edited.length?`. Edited: ${edited[edited.length - 1]}. `:''}`}</small>
        </span>
        <button type="button">Edit</button>
        <button type="button" onClick={event => actions.deleteMessage(_id)}>Delete</button>
      </footer>
    </article>
  </li>);
}

function Event (props) {
  const { user, time, action } = props;
  return (<p><small>{`event: ${action}, time: ${time}.`}</small></p>);
}

function organizer ({ messages, events }, options) {
  return ([...messages]).reduce((a,b) => {
    a.messages.push(b);
    return a;
  }, {
    messages: [],
    events: [],
    alternate: false
  })
}

export default function Messages (props) {
  const { messages, events, typing, party, thread, actions } = props;
  // organize in two ways, by type and date.
  // console.log('messages props: ',props);
  return thread ? (<section >
    <header >
      <h3>
        <span>{thread.title || thread._id}</span>
        <button type="button" style={{float:'right'}} onClick={() => actions.deleteThread(thread._id)}>Delete</button>
      </h3>
    </header>
    <ul className="message-list">{messages.filter(msg => {
      return msg.thread === thread._id;
    }).map(message => <Message key={message._id} actions={actions} {...message} />).concat(events.map(e => {
      return (<Event key={e.time} {...e}/>);
    }))}</ul>
    <footer>
      <h5>party members: {'' + party.length}. <small>{party.map(p => `Id: ${p.id}, present ${p.present}`).join('. ')}</small></h5>
      <p><small>{`${typing.length?typing.join(', '):'None'}`} typing.</small></p>
    </footer>
  </section>) : null;
}

Messages.propTypes = {
  messages: PropTypes.array,
};
