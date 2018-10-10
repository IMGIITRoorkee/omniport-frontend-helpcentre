import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Tab, Menu, Label } from 'semantic-ui-react'

import { ifRole } from 'formula_one/src/utils'
import { setIssueList, changePage, setUser, setStatusNumbers } from '../actions'

class TabStatus extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.SetUser()
    this.props.SetStatusNumbers()
    this.props.SetIssueList(1, 'opened')
  }

  handleTabChange = (event, data) => {
    let status = 'opened'
    switch (data['activeIndex']) {
      case 0:
        status = 'opened'
        break
      case 1:
        status = 'closed'
        break
      case 2:
        status = 'assigned'
        break
      default:
        status = 'opened'
    }
    this.props.ChangePage(1, status)
    this.props.SetIssueList(1, status)
  }

  render () {
    const { statusNumbers } = this.props
    const panesMaintainer = [
      {
        menuItem: (
          <Menu.Item key='opened' color='red'>
            <Icon name='exclamation circle' />
            Pending<Label color='red'>{statusNumbers['open']}</Label>
          </Menu.Item>
        )
      },
      {
        menuItem: (
          <Menu.Item key='closed' color='green'>
            <Icon name='check' />
            Resolved<Label color='green'>{statusNumbers['close']}</Label>
          </Menu.Item>
        )
      },
      {
        menuItem: (
          <Menu.Item key='assigned' color='blue'>
            <Icon name='eye' />
            Assigned<Label color='blue'>{statusNumbers['assign']}</Label>
          </Menu.Item>
        )
      }
    ]

    const panesUser = [
      {
        menuItem: (
          <Menu.Item key='opened' color='red'>
            <Icon name='exclamation circle' />
            Pending<Label color='red'>{statusNumbers['open']}</Label>
          </Menu.Item>
        )
      },
      {
        menuItem: (
          <Menu.Item key='closed' color='green'>
            <Icon name='check' />
            Resolved<Label color='green'>{statusNumbers['close']}</Label>
          </Menu.Item>
        )
      }
    ]

    return (
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={
          ifRole(
            this.props.whoAmI ? this.props.whoAmI['roles'] : [],
            'Maintainer'
          ) === 'NOT_ROLE'
            ? panesUser
            : panesMaintainer
        }
        onTabChange={this.handleTabChange}
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    queries: state.queries,
    whoAmI: state.whoAmI,
    issueList: state.issueList,
    page: state.paginationIndex,
    statusNumbers: state.statusNumbers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SetUser: () => {
      dispatch(setUser)
    },
    SetIssueList: (id, status) => {
      dispatch(setIssueList(id, status))
    },
    ChangePage: (index, status) => {
      dispatch(changePage(index, status))
    },
    SetStatusNumbers: () => {
      dispatch(setStatusNumbers())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabStatus)
