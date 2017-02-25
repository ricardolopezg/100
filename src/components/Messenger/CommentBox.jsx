import React, { Component } from 'react';

export default class CommentBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: ''
    }
  }
  render() {
    return (
      <div className="comment-box">
        <textarea id="comment"
          value={this.state.comment}
          onChange={ev => this.setState({ comment: ev.target.value })} />
        <button onClick={ev => this.setState({ comment: '' })}>Reply</button>
      </div>
    );
  }
}
