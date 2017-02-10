'use strict'

import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from '../components/Application.jsx'
import Todos from '../components/Todos.jsx'
import Media from '../components/Media/MediaRecorder.jsx'
import Messenger from '../components/Messenger/Messenger.jsx'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Media} />
    <Route path="todos" component={Todos} />
    <Route path="messenger" component={Messenger} />
    <Route path="*" />
  </Route>
)
