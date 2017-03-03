'use strict';

import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

import Threads from './Threads';
import Composer from './Composer';
import Messages from './Messages';

export { Composer, Messages, Threads };

export default class Messenger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      message: '',
      member: '',
      party: [],
      typing: false
    };

    this.emit = this.emit.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.fetchThreads = this.fetchThreads.bind(this);
    this.createThread = this.createThread.bind(this);
    this.editThread = this.editThread.bind(this);
    this.deleteThread = this.deleteThread.bind(this);
    this.joinThread = this.joinThread.bind(this);
    this.leaveThread = this.leaveThread.bind(this);
  }
  componentWillMount() {
    const openThread = this.props.params.id;
    this.props.socket.connect('/threads');

    if (openThread) this.joinThread(openThread);
  }
  componentWillUpdate(Props, State) {
    const { typing, message, length = message.length } = State,
    thread = Props.messenger.thread;

    if (typing && length !== this.state.message.length) {
      if (length === 0) this.isTyping(thread, false);
      else if (this.state.message.length === 0) this.isTyping(thread, true);
    } else if (length === 0 && this.state.message.length !== 0) this.isTyping(thread, false);
  }
  componentWillReceiveProps(Props) {
    const { router, params, messenger } = Props;
    const newID = params.id, oldID = this.props.params.id;

    if (newID) {
      if (oldID && oldID !== newID) this.leaveThread(oldID);
      else if (newID && !messenger.thread) this.joinThread(newID);
    } else if (oldID && oldID !== newID) this.leaveThread(oldID);
    //else if (messenger.thread) router.push(`/messenger/${messenger.thread._id}`);
  }
  componentWillUnmount() {
    const openThread = this.props.params.id;

    if (openThread) this.leaveThread(openThread);
    this.props.socket['/threads'].disconnect();
  }

  render() {
    const { props } = this;
    const {
      emit, sendMessage, updateMessage, deleteMessage, fetchThreads, createThread, deleteThread, joinThread, leaveThread
    } = this;
    const { threads, messages, events, typing, party, thread, actions } = props.messenger || {};
    return (<section className="messenger">
      <header>
        <div>
          <IndexLink to="/messenger" >Threads</IndexLink>
        </div>
      </header>
      {React.cloneElement(props.children, {
        threads, messages, events, typing, party, thread, composer: {
          onTitleChange: title => this.setState({ title }), title: this.state.title,
          onChange: message => this.setState({ message }), message: this.state.message,
          isTyping: typing => this.setState({ typing }), typing: this.state.typing,
          sendMessage: () => sendMessage(this.state.message, thread), party: this.state.party,
          member: this.state.member, onMemberChange: member => this.setState({ member }),
          remember: m => this.setState(state => ({ party: state.party.concat(m), member: '' })),
          dismember: m => this.setState(state => ({ party: state.party.filter(_ => _ !== m) }))
        }, actions: {
          emit, updateMessage, deleteMessage, deleteThread, fetchThreads, createThread, joinThread, leaveThread
        }
      })}
      <footer></footer>
    </section>);
  }

  emit(name, action, data = {}, fn = () => undefined) {
    const send = this.props.socket['/threads'].send, id = this.props.socket['/threads'].id;
    return send({ type: '', name, action, data: { ...data, id } }, message => {
      console.log('acknowledgement message: ',message);
      fn(message);
    });
  }
  sendMessage(message, thread) {
    return this.emit('message', 'post', { message, thread }, res => {
      const { data, error } = res;
      console.log(res, data, error);
      return this.setState({ message: '', typing: false }, () => this.props.dispatch({
        type: 'MESSENGER_NEW_MESSAGE', message: data.message
      }));
    });
  }
  updateMessage(_id, message, thread) {
    return this.emit('message', 'edit', { _id, message, thread }, res => {
      const { data, error } = res;
      console.log(_id, message, thread, res, data, error);
      return this.setState({ message: '' }, () => this.props.dispatch({
        type: 'MESSENGER_UPDATE_MESSAGE', message: data.message
      }));
    });
  }
  deleteMessage(_id) {
    return this.emit('message', 'delete', { _id }, res => {
      const { data, error } = res;
      console.log(_id, res, data, error);
      return this.props.dispatch({
        type: 'MESSENGER_DELETE_MESSAGE', message: data.message
      });
    });
  }
  isTyping(thread, typing) {
    return this.emit('thread', 'typing', { thread, typing }, res => res);
  }
  fetchThreads() {
    return this.emit('thread', 'fetch', {}, ({ data, error }) => {
      const { messages = [], threads = [] } = data || {};
      console.log('fetching threads: ',messages, threads, error);
      return data ? this.props.dispatch({
        type: 'MESSENGER_FETCH_THREADS', threads, messages
      }) : console.log(error);
    });
  }
  createThread(title, party) {
    return this.emit('thread', 'create', { title, party }, ({ data, error }) => {
      const { thread } = data;
      return data && thread ? this.setState({ title: '', party: [] }, () => this.props.dispatch({
        type: 'MESSENGER_CREATE_THREAD', thread
      })) : console.log(error);
    });
  }
  editThread(id, party, title) {
    return this.emit('thread', 'edit', { thread: id, party, title }, ({ data, error }) => {
      const { thread } = data;
      return data && thread ? this.props.dispatch({
        type: 'MESSENGER_UPDATE_THREAD', thread
      }) : console.log(error);
    });
  }
  deleteThread(id) {
    return this.emit('thread', 'delete', { thread: id  }, ({ data, error }) => {
      if (data && this.props.params.id === data.thread._id) this.props.router.push(`/messenger`);
      return data && this.props.dispatch({ type: 'MESSENGER_REMOVE_THREAD', thread: data.thread });
    });
  }
  joinThread(id) {
    return this.emit('thread', 'join', { thread: id }, ({ data, error }) => {
      const { thread, messages, time } = data || {};
      console.log(data, error, thread, messages);
      return thread ? this.props.dispatch({
        type: 'MESSENGER_JOIN_THREAD', thread, messages, party: thread.party, time
      }) && this.props.router.push(`/messenger/thread/${thread._id}`) : console.log(error);
    });
  }
  leaveThread(id) {
    return this.emit('thread', 'leave', { thread: id  }, ({ data, error }) => this.props.dispatch({
      type: 'MESSENGER_LEAVE_THREAD', error
    }));
  }
}

Messenger.propTypes = {};
