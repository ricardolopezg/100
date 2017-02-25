import React, {PropTypes} from 'react';

export default function ServerLog (props) {
  const { logs = [] } = props;
  return (<article>
    <header>
      <h3>Server Messages</h3>
    </header>
    {React.Children.toArray(logs.map(entry => <Entry {...entry} />))}
  </article>);
}

ServerLog.propTypes = {
  logs: PropTypes.array,
};

export function Entry(props) {
  const { message = '', timestamp = 0 } = props;
  return (<section>
    <p>{ message }</p>
    <p>{ new Date(timestamp).toString() }</p>
  </section>);
}

Entry.propTypes = {
  message: PropTypes.string,
  timestamp: PropTypes.number
};
