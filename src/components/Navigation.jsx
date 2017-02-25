import React, { PropTypes } from 'react'
import { Link, IndexLink } from 'react-router'

export default function Navigation (props) {
  const { children = null, user = false } = props
  return (
    <header className="menu">
      <IndexLink to="/"><h1><i>100</i></h1></IndexLink>
      <Link to="/login"><h2>Login</h2></Link>
      <Link to="/register"><h2>Sign Up</h2></Link>
      <Link to="/triage"><h2>Help Desk</h2></Link>
      <Link to="/account"><h2>Account</h2></Link>
      <Link to="/messenger"><h2>Message <img src="images/aim.logo.png" height="24px" /></h2></Link>
      <Link to="/posts"><h2>Posts</h2></Link>
      <Link to="/media"><h2>Media</h2></Link>
      <Link to="/todo"><h2>Todo</h2></Link>
      <Link to="/log"><h2>Log</h2></Link>
    </header>
  )
}
