import React, { useEffect } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk'

import { whoami } from 'services/auth/src/actions'
import PRoute from 'services/auth/pRoute'
import App from './app'
import rootReducers from './reducers'

const mapDispatchToProps = dispatch => ({
  whoami: () => dispatch(whoami()),
})

const AppRouter = connect(null, mapDispatchToProps)(props => {
  const { match, whoami } = props

  useEffect(() => {
    whoami()
  }, [whoami])

  return (
    <Provider store={createStore(rootReducers, applyMiddleware(thunk))}>
      <PRoute path={`${match.path}/`} component={App} />
    </Provider>
  )
})

export default AppRouter
