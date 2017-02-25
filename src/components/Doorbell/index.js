import React, {PropTypes} from 'react';

export default class Doorbell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      firstCall: 0,
      lastCall: 0,
      threshold: 4,
      calls: []
    };
  }

  render() {
    const { state, props } = this;
    const { count, firstCall, lastCall, threshold, calls } = state;
    const disable = calls.reduce((a, b) => a + b, lastCall)/count >= 1000/threshold ? false : true;

    return (<button type="button" disabled={disable}>Page Me</button>);
  }

  ring() {
    const now = Date.now();
    return this.setState(state => ({
      firstCall: state.count == 0 ? now : state.firstCall,
      lastCall: now, calls: state.calls.concat(now), count: ++state.count
    }), this.props.ringBell)
  }
}

Doorbell.propTypes = {
  ringBell: PropTypes.func,
  threshold: PropTypes.number
};

Doorbell.defaultProps = {
  ringBell() {
    return undefined;
  }
};
