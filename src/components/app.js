import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'

import { getMaintainers } from '../actions'
import Issue from './issue'
import IssueList from './issue-list'

import main from 'formula_one/src/css/app.css'
import blocks from '../css/app.css'

class App extends Component {
  componentDidMount () {
    this.props.GetMaintainers()
  }

  render () {
    const { match } = this.props
    return (
      <Scrollbars autoHide>
        <Container styleName='blocks.content-div'>
          <Switch>
            <Route exact path={`${match.path}`} component={IssueList} />
            <Route exact path={`${match.path}issue/:id`} component={Issue} />
            <Route render={props => <Redirect to='/404' />} />
          </Switch>
        </Container>
      </Scrollbars>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    GetMaintainers: () => {
      dispatch(getMaintainers())
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(App)
