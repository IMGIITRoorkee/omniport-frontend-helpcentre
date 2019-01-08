import React, { Component, Fragment } from 'react'
import { Icon, Dropdown, List, Segment, Label } from 'semantic-ui-react'
import { connect } from 'react-redux'
import moment from 'moment'

import { ifRole, MaintainerView, getTheme } from 'formula_one'
import {
  setActiveIssue,
  changeStatusActiveIssue,
  changeAssignee,
  getMaintainers,
  setUser
} from '../actions'
import AddAssignee from './add-assignee'

import inline from 'formula_one/src/css/inline.css'

class SideSegment extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.SetUser()
    this.props.GetMaintainers()
    this.props.SetActiveIssue(this.props.id)
  }

  getAssigneesFromIndex = a => {
    let c = []
    this.props.maintainers.map(maintainer => {
      a.map(x => {
        maintainer.id == x ? c.push(maintainer) : void 0
      })
    })
    return c
  }

  handleDelete = id => {
    const { activeIssue } = this.props
    let data = []
    if (typeof activeIssue.assignee[0] === 'object') {
      data = activeIssue.assignee
        .map(x => x.id)
        .filter(x => {
          return x !== id
        })
    } else {
      data = activeIssue.assignee.filter(x => {
        return x !== id
      })
    }
    this.props.ChangeAssignee(this.props.id, data)
  }
  handleContextRef = contextRef => this.setState({ contextRef })

  render () {
    const { activeIssue, whoAmI, maintainers } = this.props
    return (
      <Segment color={activeIssue.isClosed === true ? 'green' : 'red'}>
        <List divided relaxed>
          <List.Item>
            <List.Content>
              <List.Header>Issue opened on</List.Header>
              {moment(activeIssue.datetimeCreated).format('dddd, MMMM Do YYYY')}
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Issue opened at</List.Header>
              {moment(activeIssue.datetimeCreated).format('h:mm a')}
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Issue opened by</List.Header>
              <Label
                styleName='inline.margin-top-half inline.margin-bottom-half'
                image
                color='purple'
              >
                {Boolean(activeIssue.uploader) &&
                activeIssue.uploader.displayPicture ? (
                  <img src={activeIssue.uploader.displayPicture} />
                  ) : (
                    <Icon name='user' />
                  )}
                {Boolean(activeIssue.uploader) && activeIssue.uploader.fullName}
              </Label>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>App</List.Header>
              {activeIssue.appName}
            </List.Content>
          </List.Item>
          {activeIssue.assignee ? (
            ifRole(whoAmI.roles, 'Maintainer') === 'IS_ACTIVE' ||
            activeIssue.assignee.length !== 0 ? (
              <List.Item>
                  <List.Content>
                  <List.Header styleName='inline.margin-bottom-half'>
                    Assigned To
                    </List.Header>
                  {activeIssue.assignee
                      ? typeof activeIssue.assignee[0] === 'object'
                        ? activeIssue.assignee.map(assignee => {
                          return (
                            <Label key={assignee.id} color={getTheme()} image>
                              {Boolean(assignee.person) &&
                              assignee.person.displayPicture ? (
                                <img src={assignee.person.displayPicture} />
                                ) : (
                                  <Icon name='shield' />
                                )}
                              {Boolean(assignee.person) &&
                                assignee.person.fullName}
                              <MaintainerView which='helpcentre'>
                                <Icon
                                  name='delete'
                                  onClick={() => this.handleDelete(assignee.id)}
                                />
                              </MaintainerView>
                            </Label>
                          )
                        })
                        : this.getAssigneesFromIndex(activeIssue.assignee).map(
                          assignee => {
                            return (
                              <Label key={assignee.id} color={getTheme()} image>
                                {Boolean(assignee.person) &&
                                assignee.person.displayPicture ? (
                                  <img src={assignee.person.displayPicture} />
                                  ) : (
                                    <Icon name='shield' />
                                  )}
                                {Boolean(assignee.person) &&
                                  assignee.person.fullName}
                                <MaintainerView which='helpcentre'>
                                  <Icon
                                    name='delete'
                                    onClick={() =>
                                      this.handleDelete(assignee.id)
                                    }
                                  />
                                </MaintainerView>
                              </Label>
                            )
                          }
                        )
                      : false}
                  <MaintainerView which='helpcentre'>
                      <Fragment>
                      <List.Header styleName='inline.margin-top-half'>
                        Change
                        </List.Header>
                      <AddAssignee />
                    </Fragment>
                    </MaintainerView>
                </List.Content>
                </List.Item>
              ) : (
                false
              )
          ) : (
            false
          )}
        </List>
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    maintainers: state.maintainers,
    whoAmI: state.whoAmI,
    activeIssue: state.activeIssue
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SetUser: () => {
      dispatch(setUser())
    },
    SetActiveIssue: id => {
      dispatch(setActiveIssue(id))
    },
    ChangeStatusActiveIssue: (id, newStatus) => {
      dispatch(changeStatusActiveIssue(id, newStatus))
    },
    ChangeAssignee: (id, assignees) => {
      dispatch(changeAssignee(id, assignees))
    },
    GetMaintainers: () => {
      dispatch(getMaintainers())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideSegment)
