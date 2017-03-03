'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function Thread (props) {
  const { _id, title = _id, party, vacant, logs, actions } = props;
  return (<li>
    <div>
      <Link to={`/messenger/thread/${_id}`} >{title}</Link>
      <button type="button" style={{float:'right'}} onClick={() => actions.deleteThread(_id)}>Delete</button>
    </div>
    <p>{vacant ? null : party.reduce(m => m.present ? `${m.id}, ` : '', '')}</p>
  </li>);
}

function CreateThread (props) {
  const { title, onTitleChange, createThread, party, member, onMemberChange, addMember, removeMember } = props;
  return (<form onSubmit={event => {
    event.preventDefault();
    return createThread(title, party);
  }}>
    <input type="text" placeholder="title" value={title} onChange={event => onTitleChange(event.target.value)} />
    {party.map(m => <p key={m}>{m}<button type="button" onClick={event => removeMember(m)} style={{float: 'right'}}>remove</button></p>)}
    <div>
      <input type="text" placeholder="member" value={member}
        onChange={event => onMemberChange(event.target.value)} />
      <button type="button" onClick={event => addMember(member)}>Add Member</button>
    </div>
    <div>
      <button type="submit" disabled={!(title.length && party.length)}>Create Thread</button>
    </div>
  </form>);
}

export default function Threads (props) {
  const { threads, actions, composer } = props;
  return (<div className="messenger-threads">
    <header>
      <button type="button" onClick={event => event}>Messages</button>
      <button type="button" onClick={event => event}>Invitations</button>
      <button type="button" onClick={event => event}>Promotions</button>
      <button type="button" onClick={event => event}>Chat</button>
      <button type="button" onClick={event => actions.fetchThreads()}>Fetch Threads</button>
    </header>
    <ul>{threads.sort(thread => thread.vacant ? -1 : 1).map(thread => <Thread key={thread._id} actions={actions} {...thread} />)}</ul>
    <footer>
      <CreateThread title={composer.title} onTitleChange={composer.onTitleChange} party={composer.party}
        member={composer.member} onMemberChange={composer.onMemberChange}
        addMember={composer.remember} removeMember={composer.dismember} createThread={actions.createThread} />
    </footer>
  </div>);
}

Threads.propTypes = {
  threads: PropTypes.array,
};
