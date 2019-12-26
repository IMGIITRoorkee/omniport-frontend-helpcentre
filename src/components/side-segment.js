import React, { Component, Fragment } from 'react'
import {
  Icon,
  List,
  Segment,
  Label,
  Checkbox
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import moment from 'moment'

import { ifRole, MaintainerView } from 'formula_one'
import {
  setActiveIssue,
  changeStatusActiveIssue,
  changeAssignees,
  getMaintainers,
  setUser,
  setAllowsPolyjuice,
  changeAllowsPolyjuice
} from '../actions'
import AddAssignees from './add-assignees'

import inline from 'formula_one/src/css/inline.css'

class SideSegment extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    this.props.SetUser()
    this.props.GetMaintainers()
    this.props.SetActiveIssue(this.props.id)
    this.props.SetAllowsPolyjuice()
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
    if (typeof activeIssue.assignees[0] === 'object') {
      data = activeIssue.assignees
        .map(x => x.id)
        .filter(x => {
          return x !== id
        })
    } else {
      data = activeIssue.assignees.filter(x => {
        return x !== id
      })
    }
    this.props.ChangeAssignees(this.props.id, data)
  }
  handleContextRef = contextRef => this.setState({ contextRef })

  handleChangeAllowPolyjuice = (e, {checked}) => {
    this.props.ChangeAllowsPolyjuice(checked)
  }

  render () {
    const { activeIssue, whoAmI, maintainers, allowsPolyjuice } = this.props
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
          <List.Item>
            <List.Content>
              <List.Header>Allow maintianer access</List.Header>
              <Checkbox
                styleName='inline.margin-top-half inline.margin-bottom-half'
                toggle
                checked={
                  allowsPolyjuice.isLoaded &&
                  allowsPolyjuice.data.polyjuiceAllowed
                }
                onChange={this.handleChangeAllowPolyjuice}
                label='Allow maintainers to access your account'
              />
            </List.Content>
          </List.Item>
          {activeIssue.assignees ? (
            ifRole(whoAmI.roles, 'Maintainer') === 'IS_ACTIVE' ||
            activeIssue.assignees.length !== 0 ? (
              <List.Item>
                  <List.Content>
                  <List.Header styleName='inline.margin-bottom-half'>
                    Assigned To
                    </List.Header>
                  {activeIssue.assignees
                      ? typeof activeIssue.assignees[0] === 'object'
                        ? activeIssue.assignees.map(assignee => {
                          return (
                            <Label key={assignee.id} image>
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
                        : this.getAssigneesFromIndex(activeIssue.assignees).map(
                          assignee => {
                            return (
                              <Label key={assignee.id} image>
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
                      <AddAssignees />
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
    activeIssue: state.activeIssue,
    allowsPolyjuice: state.allowsPolyjuice
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
    ChangeAssignees: (id, assignees) => {
      dispatch(changeAssignees(id, assignees))
    },
    GetMaintainers: () => {
      dispatch(getMaintainers())
    },
    SetAllowsPolyjuice: () => {
      dispatch(setAllowsPolyjuice())
    },
    ChangeAllowsPolyjuice: allowsPolyjuice => {
      dispatch(changeAllowsPolyjuice(allowsPolyjuice))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideSegment)
