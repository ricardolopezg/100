import React, {PropTypes} from 'react';

export default function Post (props) {
  const { _id, uid, usertag, body, caption } = props;
  return (<article className="post">
    <header>
      <h3>{`@${usertag}`}</h3>
    </header>
    <section className="post-content">
      <p className="post-caption">{caption}</p>
    </section>
    <footer>
      <button type="button" >$</button>
      <button type="button" >like</button>
      <button type="button" >comment</button>
    </footer>
  </article>);
}

Post.propTypes = {};
