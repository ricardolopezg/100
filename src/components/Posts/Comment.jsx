import React, {PropTypes} from 'react';

export default function Comment (props) {
  const { _id, usertag, body } = props;
  return (<section className="comment">
    <header>
      <h4>{`@${usertag}`}</h4>
    </header>
    <p className="comment-body">{body}</p>
    <footer>
      <button type="button" >edit</button>
      <button type="button" >delete</button>
    </footer>
  </section>);
}

Comment.propTypes = {};
