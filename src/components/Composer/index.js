import React, { PropTypes, PureComponent } from 'react';

const imgHeight = '48px';

export default class Composer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      type: null,
      title: '',
      caption: '',
      message: '',
      tags: []
    };

    this.Composer = this.Composer.bind(this);
    this.Actions = this.Actions.bind(this);
    this.Types = this.Types.bind(this);
    this.Tags = this.Tags.bind(this);

    this.changeType = this.changeType.bind(this);
    this.addTag = this.addTag.bind(this);
    this.editTag = this.editTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  render() {
    const { Composer } = this;
    return (<Composer />);
  }

  Composer(props) {
    const { Actions, Types, Tags } = this;
    const { message, tags } = this.state;
    return (<div className="composer">
      <Types />
      <Tags />
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
        <Actions />
      </form>
    </div>);
  }
  Types(props) {
    const changeType = this.changeType, type = this.state.type;
    return (<div className="composer-types">
      <button type="button" onClick={event => changeType('text')}><img src="icons/essentials/edit.svg" height={imgHeight} /></button>
      <button type="button" onClick={event => changeType('audio')}><img src="icons/essentials/microphone-1.svg" height={imgHeight} /></button>
      <button type="button" onClick={event => changeType('image')}><img src="icons/essentials/photo-camera.svg" height={imgHeight} /></button>
      <button type="button" onClick={event => changeType('video')}><img src="icons/essentials/video-camera.svg" height={imgHeight} /></button>
    </div>);
  }
  Tags(props) {
    const addTag = this.addTag;
    return (<div className="composer-tags" style={{
      width: '20%', float: 'right'
    }}>
      <button type="button" onClick={event => addTag('@')}>@: User</button>
      <button type="button" onClick={event => addTag('#')}>#: Hash</button>
      <button type="button" onClick={event => addTag('&')}>&: Geo<img src="icons/essentials/placeholder.svg" height={imgHeight} /></button>
      <button type="button" onClick={event => addTag('*')}>*: Date</button>
      <button type="button" onClick={event => addTag('$')}>$: Cash</button>
    </div>);
  }
  Actions(props) {
    const { save, discard, send } = this;
    return (<aside className="composer-actions">
      <button type="button" onClick={save}>Save</button>
      <button type="button" onClick={discard}>Discard</button>
      <button type="submit" onClick={send}>Send <img src="icons/paper-plane.svg" height={imgHeight} /></button>
    </aside>);
  }
  Success(props) {
    return (<section className="composer-success" >
      <header>
        <img src="icons/essentials/success.svg" />
      </header>
      <p>Success!</p>
      <footer></footer>
    </section>);
  }
  Warning(props) {
    return (<section className="composer-warning" >
      <header>
        <img src="icons/essentials/warning.svg" />
      </header>
      <p>Failure...</p>
      <footer></footer>
    </section>);
  }

  save() {
    return this.setState({}, this.props.onSave);
  }
  discard() {
    return this.setState({}, this.props.onDiscard);
  }
  send() {
    return this.setState({}, this.props.onSend);
  }
  changeType(type = '') {
    return this.setState({ type });
  }
  addTag(type, tag = '') {
    return type && tag ? this.setState(state => ({
      tags: state.tags.concat({ type, tag, id: state.tags.length })
    })) : null;
  }
  editTag(type, tag, id) {
    return type && id ? this.setState(state => {
      state.tags[id] = { type, tag, id };
      return ({ tags: [...state.tags] });
    }) : null;
  }
  removeTag(type, id) {
    return type && id ? this.setState(state => ({
      tags: state.tags.filter((tag, i) => i === id ? false : true)
    })) : null;
  }
}

Composer.propTypes = {
  post: PropTypes.bool,
  message: PropTypes.bool,
  onSave: PropTypes.func,
  onDiscard: PropTypes.func,
  onSend: PropTypes.func
};

Composer.defaultProps = {
  post: false,
  message: false,
  onSave() { return undefined; },
  onDiscard() { return undefined; },
  onSend() { return undefined; }
};
