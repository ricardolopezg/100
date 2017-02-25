'use strict';

import React from 'react';
import { createDevTools } from 'redux-devtools';

import Dispatch from 'redux-devtools-dispatch';
import LogMonitor from 'redux-devtools-log-monitor';
import MultipleMonitors from 'redux-devtools-multiple-monitors';
import DockMonitor from 'redux-devtools-dock-monitor';

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'
    defaultIsVisible={false}>
    <MultipleMonitors>
      <LogMonitor theme='tomorrow' />
      <Dispatch />
    </MultipleMonitors>
  </DockMonitor>
);

export default DevTools;
