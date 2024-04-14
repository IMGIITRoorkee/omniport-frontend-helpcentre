import React, { useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'

import Home from './components/home'
import Issue from './components/issue'
import { getMaintainers } from './actions'
import IssuePage from './components/issue-page'
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"

const App = ({ match  , getMaintainers }) => {
  useEffect(() => {
    getMaintainers()
  }, [getMaintainers])

  return (
     <Scrollbars autoHide>
      <div className={tailwindWrapper("py-4 md:px-9 px-4 h-[100%] font-Inter")}>
        <span className={tailwindWrapper("flex-grow-2 text-xl text-black-500 font-semibold")}>Helpcentre</span>
        <Switch>
          <Route exact path={`${match.path}`} component={Home} />
          <Route exact path={`${match.path}issues`} component={IssuePage} />
          <Route exact path={`${match.path}issue/:id`} component={Issue} />
          <Route render={() => <Redirect to="/404" />} />
        </Switch>
      </div>
    </Scrollbars>
  )
}

const mapDispatchToProps = dispatch => ({
  getMaintainers: () => {
    dispatch(getMaintainers())
  },
})

export default connect(null, mapDispatchToProps)(App)
