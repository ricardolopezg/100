'use strict';

import React, { PropTypes, PureComponent } from 'react';
import { GUM, MediaRecorder } from './../../util/gum';

export default class Media extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      mimeType: '',
      codec: '',
      bitsPerSecond: 128000,
      audioBitsPerSecond : 128000,
      videoBitsPerSecond : 2500000,
      streaming: false,
      recorder: false,
      recordingStart: false,
      recording: false,
      playing: false
    };

    this.Recorder = this.Recorder.bind(this);
    this.RecorderOptions = this.RecorderOptions.bind(this);

    this.getUserMedia = this.getUserMedia.bind(this);
  }
  render() {
    const { Recorder, RecorderOptions } = this
    return (<div className="media">
      <Recorder />
    </div>);
  }

  Player(props) {
    const { playing } = this.state;
    return (<section>

    </section>);
  }
  Download(props) {
    const { playing } = this.state;
    return (<section>

    </section>);
  }
  RecorderOptions(props) {
    const {
      mimeType, bitsPerSecond, audioBitsPerSecond, videoBitsPerSecond
    } = this.state;

    return (<div>
      <section>
        <header>
          <p>MIME: {mimeType || 'none'}</p>
          <p>Bits Per Second: {bitsPerSecond || 0}</p>
          <p>Audio Bits Per Second: {audioBitsPerSecond || 0}</p>
          <p>Video Bits Per Second: {videoBitsPerSecond || 0}</p>
        </header>
        <p>
          <label>MIME Type:
            <select onChange={event => {
              this.setState({
                mimeType: event.target.value
              });
            }}>
              <option value="audio/ogg">Audio: OGG</option>
              <option value="audio/mpeg">Audio: MPEG</option>
              <option value="video/mp4">Video: MP4</option>
              <option value="video/mpeg">Video: MPEG</option>
            </select>
          </label>
        </p>
        <p>
          <label>Bits Per Second: <select onChange={event => {
            this.setState({
              bitsPerSecond: event.target.value
            });
          }}>
            <option value="128000">128 kbps</option>
            <option value="192000">192 kbps</option>
            <option value="256000">256 kbps</option>
            <option value="320000">320 kbps</option>
          </select></label>
        </p>
        <p>
          <label>Audio Bits Per Second: <select onChange={event => {
            this.setState({
              audioBitsPerSecond: event.target.value
            });
          }}>
            <option value="128000">128 kbps</option>
            <option value="192000">192 kbps</option>
            <option value="256000">256 kbps</option>
            <option value="320000">320 kbps</option>
          </select></label>
        </p>
        <p>
          <label>Video Bits Per Second: <select onChange={event => {
            this.setState({
              videoBitsPerSecond: event.target.value
            });
          }}>
            <option value={(320 * 240) * 24}>320 x 240</option>
            <option value={(480 * 640) * 24}>480 x 640</option>
            <option value={(1024 * 768) * 24}>1024 x 768</option>
          </select></label>
        </p>
        <p><button onClick={event => {
          this.record({ audio: true }, (recorder => {
          }));
        }}>Record Media</button></p>
      </section>
    </div>);
  }
  Recorder(props) {
    const { recorder, recordingStart, recording } = this.state, Options = this.RecorderOptions;
    return recorder ? (<section>
      <p><button onClick={event => {
        recording ? this.recorder.pause() : this.recorder.resume();
      }}>{recording ? 'Pause' : 'Resume'}</button></p>
      <p><button onClick={event => {
        recordingStart ? this.recorder.stop() : this.recorder.start();
      }}>{recording ? 'Stop' : 'Start'}</button></p>
    </section>) : <Options />;
  }

  downloadChunks() {
    const blob = new Blob(this.recordingChunks, { 'type': this.state.mimeType });
    this.recordingChunks = [];
  }
  record(constraints = { audio: true }, cb) {
    const { mimeType, bitsPerSecond, audioBitsPerSecond, videoBitsPerSecond } = this.state;
    return this.getUserMedia(constraints, stream => {
      MediaRecorder(stream, {
        mimeType, bitsPerSecond
      }).then(recorder => {
        this.setState({ recorder: true }, () => {
          this.recordingChunks = [];
          recorder.ondataavailable(e => {
            this.recordingChunks.push(e.data);
          });
          recorder.onstart(e => {
            this.setState({ recordingStart: true, recording: true });
          });
          recorder.onstop(e => {
            this.setState({ recordingStart: false, recording: false });
          });
          recorder.onresume(e => {
            this.setState({ recording: true });
          });
          recorder.onpause(e => {
            this.setState({ recording: false });
          });
          recorder.onerror(e => {
            this.setState({
              error: new Error({
                type: 'MediaRecorder',
                state: {
                  mimeType: recorder.mimeType,
                  audioBitsPerSecond: recorder.audioBitsPerSecond,
                  videoBitsPerSecond: recorder.videoBitsPerSecond,
                  state: recorder.state
                },
                message: e.message
              })
            });
          });
          this.recorder = recorder;
          cb ? cb(recorder) : null;
        });
      }).catch(e => console.log(e));
    });
  }
  getUserMedia(constraints, cb) {
    return this.stream ? this.stream : GUM(constraints).then(stream => {
      console.log('GUM stream: ', stream);
      this.setState({ streaming: true }, () => {
        this.stream = stream;
        cb ? cb(stream) : null;
      });
      return stream;
    }).catch(e => console.log(e));
  }
}

Media.propTypes = {};

Media.defaultProps = {
  mimeTypes: {
    audio: [
      'audio/webm', 'audio/webm\;codecs=opus', 'audio/ogg; codecs=opus'
    ],
    video: [
      'video/webm', 'video/webm\;codecs=vp8', 'video/webm\;codecs=daala',
      'video/webm\;codecs=h264', 'video/mpeg'
    ]
  }
};
