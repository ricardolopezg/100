'use strict'

import React, { PureComponent, PropTypes } from 'react'
import { push, replace, go, goForward, goBack } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ACTIONS as ioACTIONS } from './../store/redux.io'

import ACTIONS from '../store/actions'
import Navigation from './Navigation.jsx'

class Application extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      fullscreen: false,
      logs: []
    }
  }

  render () {
    const { props, state, compareAndCast } = this
    const { dispatch, user, socket, messenger, todo, router } = props
    return (<main id="main" role="main" ref={m => m ? this.main = m : null}>
      <section className="navigator" id="nav">
        <Navigation />
        <section className="main-content">{
          props.children ? compareAndCast(props.children, {
            app: {}, dispatch, user, todo, messenger, socket, router
          }) : null
        }</section>
        <footer>
          <h6 style={{textAlign:'center'}}>{`Copyright © ${new Date().getFullYear()} 100 L.L.C. All Rights Reserved.`}</h6>
        </footer>
      </section>
    </main>)
  }

  compareAndCast(child, props) {
    return React.cloneElement(child, props);
  }
}

Application.propTypes = {
  children: PropTypes.element,
  history: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object,
  route: PropTypes.object,
  routes: PropTypes.array,
  routeParams: PropTypes.object,
  routing: PropTypes.object,
  socket: PropTypes.object,
  router: PropTypes.object,
  user: PropTypes.object,
  messenger: PropTypes.object,
  posts: PropTypes.array,
  todo: PropTypes.object,
  tokens: PropTypes.object
}

Application.defaultProps = {}

export default connect(
  function mapStateToProps (state, ownProps) {
    return { ...ownProps, ...state }
  },
  function mapDispatchToProps (dispatch, ownProps) {
    return {
      dispatch,
      tokens: {
        set: (key, value) => dispatch({ type: '@@tokens/SET', key, value }),
        remove: (key) => dispatch({ type: '@@tokens/REMOVE', key }),
        clear: () => dispatch({ type: '@@tokens/CLEAR' })
      },
      socket: bindActionCreators(ioACTIONS, dispatch),
      router: bindActionCreators({
         push, replace, go, goForward, goBack
      }, dispatch)
    }
  },
  function mergeProps (stateProps, dispatchers, ownProps) {
    return { ...Object.keys(dispatchers).reduce((a,b) => {
      return a[b] ? { ...a, [b]: { ...a[b], ...dispatchers[b]} } : { ...a, [b]: dispatchers[b] }
    }, { ...stateProps }) }
  }, { pure: true, withRef: false }
)(Application)
