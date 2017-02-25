'use strict'

import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from '../components/Application.jsx'

import Home from '../components/Home.jsx'

import Authentication, {
  Login, Register, Triage, Recovery
} from '../components/Authentication/Authentication.jsx'

import Account, {
  Profile
} from '../components/Account/Account.jsx'

import Messenger, {
  Composer, Messages, Threads
} from '../components/Messenger'

import Todos from '../components/Todos'
import PostMaster from '../components/Posts/Messenger.jsx'

import ServerLog from '../components/Log'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />

    <Route component={Authentication}>
      <Route name="Sign In" path="login" component={Login} />
      <Route name="Register" path="register" component={Register} />
      <Route name="Triage" path="triage" component={Triage} />
      <Route name="Recovery" path="recovery" component={Recovery} />
      <Route name="Verification" path="verify/:token" />
    </Route>

    <Route name="Account" path="account" component={Account}>
      <IndexRoute component={Profile} />
    </Route>

    <Route name="Posts" path="posts" component={PostMaster}>
      <Route name="Post" path=":id" />
    </Route>

    <Route name="Messenger" path="messenger" component={Messenger}>
      <IndexRoute component={Threads} />
      <Route name="Thread" path=":id" component={Composer} />
    </Route>

    <Route name="Media" path="media" />
    <Route name="Todo" path="todo" component={Todos} />

    <Route name="Server Log" path="log" component={ServerLog} />
    <Route path="*" />
  </Route>
)
