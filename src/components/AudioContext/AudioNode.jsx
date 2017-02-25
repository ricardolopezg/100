import React, { PureComponent, PropTypes } from 'react';

export default class AudioNode extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>AudioCTX</div>);
  }
}

AudioNode.propTypes = {
  context: PropTypes.object.isRequired,
  source: PropTypes.object.isRequired,
  destination: PropTypes.object.isRequired,
  inputs: PropTypes.array,
  outputs: PropTypes.array,
  id: PropTypes.string.isRequired
};

AudioNode.defaultProps = {};
