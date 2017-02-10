import React, { PureComponent, PropTypes } from 'react';

export default function Node (props) {
  return null;
}

export class Destination extends PureComponent {
  constructor(props) {
    super(props);
  }


  render() {
    return (<div>AudioCTX</div>);
  }
  Player (props) {
    return (<audio />);
  }

  createContext(options) {
    return new (window.AudioContext || window.webkitAudioContext)();
  }
}

Destination.propTypes = {
  src: PropTypes.object,
  offline: PropTypes.bool,
};

Destination.defaultProps = {};
