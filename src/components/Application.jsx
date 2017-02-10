'use strict'

import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import actions from '../store/actions'
import Navigation from './Navigation.jsx'

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
