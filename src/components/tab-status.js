import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Icon, Tab, Menu, Label, Segment } from 'semantic-ui-react'
import { MobileView, BrowserView } from 'react-device-detect'

import { ifRole } from 'formula_one'
import { setIssueList, changePage, setUser, setStatusNumbers } from '../actions'

class TabStatus extends Component {
  componentDidMount () {
    this.props.SetUser()
    this.props.SetStatusNumbers()
    this.props.SetIssueList(1, 'opened')
  }

  handleDropdownChange = (event, { value }) => {
    this.props.ChangePage(1, value)
    this.props.SetIssueList(1, value)
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
    const optionsMaintainer = [
      {
        key: 1,
        content: (
          <span>
            <Icon name='exclamation circle' color='red' />
            {`Opened (${statusNumbers['open']})`}
          </span>
        ),
        value: 'opened',
        text: `Opened (${statusNumbers['open']})`
      },
      {
        key: 2,
        content: (
          <span>
            <Icon name='check' color='green' />
            {`Closed (${statusNumbers['close']})`}
          </span>
        ),
        value: 'closed',
        text: `Closed (${statusNumbers['close']})`
      },
      {
        key: 3,
        content: (
          <span>
            <Icon name='eye' color='blue' />
            {`Assigned (${statusNumbers['assign']})`}
          </span>
        ),
        value: 'assigned',
        text: `Assigned (${statusNumbers['assign']})`
      }
    ]
    const options = [
      {
        key: 1,
        content: (
          <span>
            <Icon name='exclamation circle' color='red' />
            {`Opened (${statusNumbers['open']})`}
          </span>
        ),
        value: 'opened',
        text: `Opened (${statusNumbers['open']})`
      },
      {
        key: 2,
        content: (
          <span>
            <Icon name='check' color='green' />
            {`Closed (${statusNumbers['close']})`}
          </span>
        ),
        value: 'closed',
        text: `Closed (${statusNumbers['close']})`
      }
    ]
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
      <React.Fragment>
        <BrowserView>
          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={
              ifRole(
                this.props.whoAmI ? this.props.whoAmI['roles'] : [],
                'Maintainer'
              ) === 'IS_ACTIVE'
                ? panesMaintainer
                : panesUser
            }
            onTabChange={this.handleTabChange}
          />
        </BrowserView>
        <MobileView>
          <Segment secondary attached textAlign='center'>
            <Dropdown
              options={
                ifRole(
                  this.props.whoAmI ? this.props.whoAmI['roles'] : [],
                  'Maintainer'
                ) === 'NOT_ROLE'
                  ? options
                  : optionsMaintainer
              }
              onChange={this.handleDropdownChange}
              selection
              defaultValue='opened'
            />
          </Segment>
        </MobileView>
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabStatus)
