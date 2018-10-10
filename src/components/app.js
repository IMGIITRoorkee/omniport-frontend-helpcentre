import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'

import Sidebar from 'core/common/src/components/primary-sidebar'
import AppHeader from 'formula_one/src/components/app-header'
import AppFooter from 'formula_one/src/components/app-footer'
import { getMaintainers } from '../actions'
import Issue from './issue'
import PostIsuue from './post-issue'
import IssueList from './issue-list'

import inline from 'formula_one/src/css/inline.css'
import blocks from '../css/app.css'

class App extends Component {
  constructor (props) {
    super(props)
  }

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
      <div styleName='inline.flex-column inline.height-full'>
        <AppHeader
          appName='Helpcentre'
          appLogo={
            'http://www.iconhot.com/icon/png/rrze/720/user-helpdesk-faq.png'
          }
          appLink={`http://${window.location.host}${match.path}`}
          userDropdown
        />
        <Container textAlign='justified' styleName='blocks.content-div'>
          <Switch>
            <Route exact path={`${match.path}`} component={IssueList} />
            <Route path={`${match.path}issue/:id`} component={Issue} />
          </Switch>
        </Container>
        <AppFooter creators={creators} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    GetMaintainers: () => {
      dispatch(getMaintainers())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
