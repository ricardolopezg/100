import React, {PropTypes} from 'react';

const imgHeight = '48px';

export default class PostMaster extends React.PureComponent {
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
    const Composer = this.Composer = this.Composer.bind(this);
  }

  Thread(props) {
    const { messages } = props, Message = this.Message, Composer = this.Composer;
    return (<section>{messages.length ? (
      <ul className="message-thread">{React.Children.toArray(messages.map(message => <li><Message { ...message } /></li>))}</ul>
    ) : null}<hr /><Composer /></section>);
  }
  Message(props) {
    const MessageReactions = this.MessageReactions;
    const { _id, title, from, text, timestamp, comments = [], likes = [] } = props;
    // icons, give user a responsibility to describe their icons/avatars/content/media for accessability.
    return (<article className="message" >
      <header>
        <h3>{title}</h3>
        <cite className="message-author">{from}</cite>
      </header>
      <section>
        <blockquotes><p className="message-text">{text}</p></blockquotes>
      </section>
      <MessageReactions comments={comments} />
      <footer>
        <time className="message-timestamp" dateTime={new Date(timestamp).toString()}>{timestamp}</time>
      </footer>
    </article>);
  }
  MessageReactions(props) {
    const { comments } = props;
    return (<aside className="message-reactions">{React.Children.toArray((false ? ([
      <button type="button"><img src="icons/essentials/like-2.svg" height="40px" /></button>,
      <span>{`${ comments.length } comments`}</span>,
      <button type="button"><img src="icons/badge.reply.svg" height="40px" /></button>,
      <button type="button"><img src="icons/essentials/flag.svg" height="40px" /></button>
    ]) : ([
      <button type="button"><img src="icons/essentials/like-2.svg" height="40px" /></button>,
      <span>{`${ comments.length } comments`}</span>,
      <button type="button"><img src="icons/badge.reply.svg" height="40px" /></button>,
      <button type="button"><img src="icons/essentials/compose.svg" height="40px" /></button>,
      // <button type="button"><img src="icons/badge.paperclip.svg" height="40px" /></button>
      <button type="button"><img src="icons/essentials/garbage-1.svg" height="40px" /></button>
    ])).concat([
        <button type="button">Share</button>
    ]))}</aside>);
  }
  MessageFlags(props) {
    return (<div>
      <button type="button">Inappropriate</button>
      <button type="button">Vulgar</button>
      <button type="button">Threatening</button>
    </div>);
  }
  Composer(props) {
    const { message } = this.state;
    return (<div className="composer">
      <div className="compose-types">
        <button type="button"><img src="icons/essentials/compose.svg" height={imgHeight} /></button>
        <button type="button"><img src="icons/essentials/microphone-1.svg" height={imgHeight} /></button>
        <button type="button"><img src="icons/essentials/photo-camera.svg" height={imgHeight} /></button>
        <button type="button"><img src="icons/essentials/video-camera.svg" height={imgHeight} /></button>
      </div>
      <div className="compose-tags" style={{
        width: '20%', float: 'right'
      }}>
        <button><img src="icons/essentials/placeholder.svg" height={imgHeight} /></button>
        <h3><button type="button">$</button></h3>
        <h3><button type="button">#</button></h3>
        <h3><button type="button">@</button></h3>
        <h3><button type="button">&</button></h3>
      </div>
      <form id="composer" onSubmit={event => event.preventDefault()} style={{
        width: '80%', float: 'left'
      }}>
        <div>
          <input name="composer-title" type="text" placeholder="Title" value={message}
            onChange={event => this.setState({ title: event.target.value })} />
        </div>
        <div>
          <input name="composer-message" type="text" placeholder="Message" value={message}
            onChange={event => this.setState({ message: event.target.value })} />
        </div>
        <button type="submit"><img src="icons/paper-plane.svg" height={imgHeight} /></button>
      </form>
    </div>);
  }
  ComposerActions(props) {
    return (<aside className="composer-actions">
      <button type="button">Save</button>
      <button type="button">Discard</button>
      <button type="button">Send</button>
    </aside>);
  }
  ComposerTypes(props) {
    return (<div className="composer-types">
      <button type="button"><img src="icons/essentials/edit.svg" height={imgHeight} /></button>
      <button type="button"><img src="icons/essentials/microphone-1.svg" height={imgHeight} /></button>
      <button type="button"><img src="icons/essentials/photo-camera.svg" height={imgHeight} /></button>
      <button type="button"><img src="icons/essentials/video-camera.svg" height={imgHeight} /></button>
    </div>);
  }
  ComposerTags(props) {
    return (<div className="composer-tags">
      <button type="button">Usertag</button>
      <button type="button">Hashtag</button>
      <button type="button">Geotag</button>
      <button type="button">Datetag</button>
      <button type="button">Cashtag</button>
      <button type="button">Labeltag</button>
    </div>);
  }

  render() {
    const { Thread } = this;
    return (<section className="messenger" >
      <Thread messages={this.props.messages} />
    </section>);
  }

}

PostMaster.propTypes = {
  messages: PropTypes.array,
};
PostMaster.defaultProps = {
  messages: [{
    _id: 'akcgi778eiuco7hai',
    title: 'Superbowl',
    from: '@mike',
    text: 'This is outrageous!'
  }]
};
