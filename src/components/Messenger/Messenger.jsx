import React, {PropTypes} from 'react';

export default class Messenger extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    };

    const Thread = this.Thread = this.Thread.bind(this);
    Thread.propTypes = {
      title: PropTypes.string
    };
    const Message = this.Message = this.Message.bind(this);
    Message.propTypes = {
      from: PropTypes.string,
      text: PropTypes.string
    };
    const ChatBox = this.ChatBox = this.ChatBox.bind(this);
  }
  Thread(props) {
    const { messages } = props, Message = this.Message, ChatBox = this.ChatBox;
    return (<section>{messages.length ? (
      <ul className="message-thread">{React.Children.toArray(messages.map(message => <li><Message { ...message } /></li>))}</ul>
    ) : null}<hr /><ChatBox /></section>);
  }
  Message(props) {
    const { _id, title, from, text, timestamp } = props;
    // icons, give user a responsibility to describe their icons/avatars/content/media for accessability.
    return (<article className="message" >
      <header>
        <h3>{title}</h3>
        <cite className="message-author">{from}</cite>
      </header>
      <section>
        <p className="message-text">{text}</p>
      </section>
      <aside>
        <button type="buttion"><img src="icons/essentials/like-2.svg" height="40px" /></button>
        <button type="buttion"><img src="icons/badge.reply.svg" height="40px" /></button>
        <button type="buttion"><img src="icons/essentials/flag.svg" height="40px" /></button>
        <button type="buttion"><img src="icons/badge.paperclip.svg" height="40px" /></button>
        <button type="buttion"><img src="icons/essentials/edit.svg" height="40px" /></button>
        <button type="buttion"><img src="icons/essentials/garbage-1.svg" height="40px" /></button>
      </aside>
      <footer>
        <time className="message-timestamp" dateTime={new Date(timestamp).toString()}>{timestamp}</time>
      </footer>
    </article>);
  }
  MessageTypes(props) {
    return (<div>
      <button type="buttion"><img src="icons/essentials/compose.svg" height="60px" /></button>
      <button type="buttion"><img src="icons/essentials/microphone-1.svg" height="60px" /></button>
      <button type="buttion"><img src="icons/essentials/photo-camera.svg" height="60px" /></button>
      <button type="buttion"><img src="icons/essentials/video-camera.svg" height="60px" /></button>
    </div>);
  }
  MessageTags(props) {
    return (<div>
      <button type="buttion">Usertag</button>
      <button type="buttion">Hashtag</button>
      <button type="buttion">Geotag</button>
      <button type="buttion">Datetag</button>
      <button type="buttion">Cashtag</button>
      <button type="buttion">Labeltag</button>
    </div>);
  }
  MessageFlags(props) {
    return (<div>
      <button type="buttion">Inappropriate</button>
      <button type="buttion">Vulgar</button>
      <button type="buttion">Threatening</button>
    </div>);
  }
  MessageActions(props) {
    return (<aside>
      <button type="buttion">Save</button>
      <button type="buttion">Discard</button>
      <button type="buttion">Send</button>
    </aside>);
  }
  MessagePostActions(props) {
    return (<aside>{React.Children.toArray((false ? ([
        <button type="buttion"><img src="icons/essentials/like-2.svg" height="40px" /></button>,
        <button type="buttion"><img src="icons/badge.reply.svg" height="40px" /></button>,
        <button type="buttion"><img src="icons/essentials/flag.svg" height="40px" /></button>
      ]) : ([
        <button type="buttion"><img src="icons/badge.paperclip.svg" height="40px" /></button>,
        <button type="buttion"><img src="icons/essentials/edit.svg" height="40px" /></button>,
        <button type="buttion"><img src="icons/essentials/garbage-1.svg" height="40px" /></button>
      ])).concat([
        <button type="buttion">Share</button>
      ]))
    }</aside>);
  }
  ChatBox(props) {
    const { message } = this.state;
    return (<form id="message-form" onSubmit={event => event.preventDefault()}>
      <input name="message" type="text" placeholder="Message" value={message}
        onChange={event => this.setState({ message: event.target.value })} />
      <div>
        <img src="icons/essentials/compose.svg" height="60px" />
        <img src="icons/essentials/microphone-1.svg" height="60px" />
        <img src="icons/essentials/photo-camera.svg" height="60px" />
        <img src="icons/essentials/video-camera.svg" height="60px" />
        <img src="icons/essentials/placeholder.svg" height="60px" />
      </div>
      <button type="submit"><img src="icons/paper-plane.svg" height="60px" /></button>
    </form>);
  }
  Success(props) {
    return (<section className="message-success" >
      <img src="icons/essentials/success.svg" />
    </section>);
  }
  Warning(props) {
    return (<section className="message-warning" >
      <img src="icons/essentials/warning.svg" />
    </section>);
  }

  render() {
    const { Thread } = this;
    return (<section className="messenger" >
      <Thread messages={this.props.messages} />
    </section>);
  }

}

Messenger.propTypes = {
  messages: PropTypes.array,
};
Messenger.defaultProps = {
  messages: [{
    _id: 'akcgi778eiuco7hai',
    title: 'Superbowl',
    from: '@mike',
    text: 'This is outrageous!'
  }]
};
