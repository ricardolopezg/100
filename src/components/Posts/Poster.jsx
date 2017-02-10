import React, { PropTypes, PureComponent } from 'react';

export default class Poster extends PureComponent {
  constructor(props) {
    super(props);

    thi.state = {
      type: '', // type of post.
      audio: [],
      video: [],
      images: [],
      caption: '',
      saleable: false
    }
  }

  render() {
    const { props, state } = this;
    return (<div>
      <form >
        <div>

        </div>
        <div>
          <p>
            <label>image/*,video/*,audio/* <input type="file" accept="image/*,video/*,audio/*" onChange={event => {
              console.log(event);
            }} /></label>
        </p>
        </div>
        <div>
          <label>Caption:</label>
          <input id="caption" type="text" value={state.caption} onChange={({ target }) => this.setState({
            caption: target.value
          })} />
        </div>
        <button type="button" >add</button>
        <button type="button" >cancel</button>
      </form>
    </div>);
  }
}

Poster.propTypes = {
};
