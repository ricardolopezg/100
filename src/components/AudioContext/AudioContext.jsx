import React, { Component, PropTypes } from 'react';

export default function (props) {
  const audioctx = window.AudioContext = (window.AudioContext || window.webkitAudioContext || null);
  return audioctx ? <AudioContext /> : null;
}

export class AudioContext extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate() { return false; }
  componentWillReceiveProps(Props) {

  }

  render() {
    const {  } = this.state;
    return this.props.player ? <audio /> : null;
  }


  createContext(options) {
    return new (window.AudioContext || window.webkitAudioContext)();
  }
}

AudioContext.propTypes = {
  id: PropTypes.string.isRequired,
  source: PropTypes.object,
  offline: PropTypes.bool,
};

AudioContext.defaultProps = {
  supports: {
    context: window.AudioContext || window.webkitAudioContext,
    offline: window.OfflineAudioContext
  }
};

AudioContext.nodes = {
// AnalyserNode
// AudioBuffer
// AudioBufferSourceNode
// AudioChannelManager
// AudioContext
// AudioDestinationNode
// AudioListener
// AudioNode
// AudioParam
// AudioProcessingEvent
// BiquadFilterNode
// ChannelMergerNode
// ChannelSplitterNode
// ConvolverNode
// DelayNode
// DynamicsCompressorNode
// GainNode
// MediaElementAudioSourceNode
// MediaStreamAudioDestinationNode
// MediaStreamAudioSourceNode
// NotifyAudioAvailableEvent
// OfflineAudioCompletionEvent
// OfflineAudioContext
// OscillatorNode
// PannerNode
// PeriodicWave
// ScriptProcessorNode
// StereoPannerNode
// WaveShaperNode
};
