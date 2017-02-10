'use strict'

import React, { PureComponent, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import actions from '../store/actions'

function Navigation (props) {
  const { children = null } = props
  return (<section className="layout" id="nav">
    <header>
      <Link to="/">
        <h1><i><h1>Welcome to 100!</h1></i></h1>
      </Link>
      <Link to="/todos">Todos</Link>
    </header>
    <section id="main-content">{children}</section>
    <footer>
      <h6>{`Copyright © ${new Date().getFullYear()} 100 L.L.C. All Rights Reserved.`}</h6>
    </footer>
  </section>)
}

class Application extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      fullscreen: false
    }
  }
  //componentDidMount() { console.log(this.main); }

  render () {
    const { props, state } = this
    return (<main id="main" role="main" ref={m => m ? this.main = m : null}>
      <Navigation>{
        props.children ? React.cloneElement(props.children, {
          todo: props.todo
        }) : null
      }</Navigation>
    </main>)
  }
}

Application.propTypes = {
  posts: PropTypes.array,
  http: PropTypes.object,
  todo: PropTypes.object,
  tokens: PropTypes.object,
  user: PropTypes.object
}
Application.defaultProps = {}

export default connect(
  function mapStateToProps (state, ownProps) {
    return { ...state.toJS(), ...ownProps }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return { ...Object.keys(actions).reduce((a,b) => {
      return { ...a, [b]: bindActionCreators(actions[b], dispatch) }
    }, {}) }
  },
  function mergeProps (stateProps, dispatchers, ownProps) {
    return { ...Object.keys(dispatchers).reduce((a,b) => {
      return a[b] ? { ...a, [b]: { ...a[b], ...dispatchers[b]} } : { ...a, [b]: dispatchers[b] }
    }, { ...stateProps }) }
  }, { pure: true, withRef: false }
)(Application)
