import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { isMobile, isBrowser } from 'react-device-detect'

import Sidebar from 'core/common/src/components/primary-sidebar'
import { AppHeader, AppFooter, AppMain } from 'formula_one'
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
    const creators = [
      {
        name: 'Dhruv Bhanushali',
        role: 'Mentor'
      },
      {
        name: 'Shaddy Garg',
        role: 'Backend Developer'
      },
      {
        name: 'Praduman Goyal',
        role: 'Frontend Developer'
      }
    ]
    const { match } = this.props

    return (
      <div styleName='main.app'>
        <AppHeader
          appName='Helpcentre'
          appLink={`http://${window.location.host}${match.path}`}
          userDropdown
        />
        <AppMain>
          {isMobile && <Sidebar />}
          <div styleName='main.app-main'>
            {isBrowser && <Sidebar />}
            <Scrollbars autoHide>
              <Container styleName='blocks.content-div'>
                <Switch>
                  <Route exact path={`${match.path}`} component={IssueList} />
                  <Route path={`${match.path}issue/:id`} component={Issue} />
                </Switch>
              </Container>
            </Scrollbars>
          </div>
        </AppMain>
        <AppFooter creators={creators} />
      </div>
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
