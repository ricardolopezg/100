import React, { PropTypes } from 'react'
import { Link } from 'react-router'

export default function Navigation (props) {
  const { children = null } = props
  return (<section className="layout" id="nav">
    <header>
      <Link to="/">
        <h1><i><h1>Welcome to 100!</h1></i></h1>
      </Link>
      <Link to="/todos"><img src="images/todo_list1600.png" height="60px" /></Link>
      <Link to="/messenger"><img src="images/aim.logo.png" height="60px" /></Link>
    </header>
    <section id="main-content">{children}</section>
    <footer>
      <h6>{`Copyright © ${new Date().getFullYear()} 100 L.L.C. All Rights Reserved.`}</h6>
    </footer>
  </section>)
}
