import React, { Component, Fragment } from 'react'
import { Icon, Dropdown, List, Segment, Label } from 'semantic-ui-react'
import { connect } from 'react-redux'
import moment from 'moment'

import { ifRole } from 'formula_one/src/utils'
import {
  setActiveIssue,
  changeStatusActiveIssue,
  changeAssignee,
  getMaintainers,
  setUser
} from '../actions'
import inline from 'formula_one/src/css/inline.css'

class SideSegment extends Component {
  constructor (props) {
    super(props)
  }

  state = {}

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

  // assignees () {
  //   const { activeIssue } = this.props
  //   return activeIssue.assignee
  //     ? typeof activeIssue.assignee[0] === 'object'
  //         ? activeIssue.assignee.map(assignee => {
  //           return (
  //             <Label key={assignee['id']} color='blue' image>
  //               {assignee['person']
  //                   ? assignee['person']['displayPicture']
  //                       ? <img src={assignee['person']['displayPicture']} />
  //                       : <Icon name='user' />
  //                   : void 0}
  //               {assignee['person'] ? assignee['person']['shortName'] : null}
  //             </Label>
  //           )
  //         })
  //         : this.getAssigneesFromIndex(activeIssue.assignee).map(assignee => {
  //           return (
  //             <Label key={assignee['id']} color='blue' image>
  //               {assignee['person']
  //                   ? assignee['person']['displayPicture']
  //                       ? <img src={assignee['person']['displayPicture']} />
  //                       : <Icon name='user' />
  //                   : void 0}
  //               {assignee['person'] ? assignee['person']['shortName'] : null}
  //             </Label>
  //           )
  //         })
  //     : void 0
  // }

  handleChange = (e, { value }) => {
    this.props.ChangeAssignee(this.props.id, value)
  }
  handleContextRef = contextRef => this.setState({ contextRef })

  render () {
    const { activeIssue, whoAmI, maintainers } = this.props
    return (
      <Segment color={activeIssue.isClosed === true ? 'green' : 'red'}>
        <List divided relaxed>
          <List.Item>
            <List.Content>
              <List.Header>Issue Opened On</List.Header>
              {moment(activeIssue['datetimeCreated']).format(
                'dddd, MMMM Do YYYY'
              )}
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Issue Opened At</List.Header>
              {moment(activeIssue['datetimeCreated']).format('h:mm a')}
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Issue Opened By</List.Header>
              <Label
                styleName='inline.margin-top-half inline.margin-bottom-half'
                image
                color='purple'
              >
                {Boolean(activeIssue['uploader']) &&
                  <img src={activeIssue['uploader']['displayPicture']} />}
                {Boolean(activeIssue['uploader']) &&
                  activeIssue['uploader']['fullName']}
              </Label>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>App</List.Header>
              {activeIssue['appName']}
            </List.Content>
          </List.Item>
          {activeIssue['assignee']
            ? ifRole(whoAmI['roles'], 'Maintainer') === 'IS_ACTIVE' ||
                activeIssue['assignee'].length !== 0
                ? <List.Item>
                  <List.Content>
                    <List.Header styleName='inline.margin-bottom-half'>
                        Assigned To
                      </List.Header>
                    {activeIssue.assignee
                        ? typeof activeIssue.assignee[0] === 'object'
                            ? activeIssue.assignee.map(assignee => {
                              return (
                                <Label
                                  key={assignee['id']}
                                  color='blue'
                                  image
                                  >
                                  {Boolean(assignee['person']) &&
                                      assignee['person']['displayPicture']
                                      ? <img
                                        src={
                                            assignee['person']['displayPicture']
                                          }
                                        />
                                      : <Icon name='user' />}
                                  {Boolean(assignee['person']) &&
                                      assignee['person']['shortName']}
                                </Label>
                              )
                            })
                            : this.getAssigneesFromIndex(
                                activeIssue.assignee
                              ).map(assignee => {
                                return (
                                  <Label
                                    key={assignee['id']}
                                    color='blue'
                                    image
                                  >
                                    {Boolean(assignee['person']) &&
                                      assignee['person']['displayPicture']
                                      ? <img
                                        src={
                                            assignee['person']['displayPicture']
                                          }
                                        />
                                      : <Icon name='user' />}
                                    {Boolean(assignee['person']) &&
                                      assignee['person']['shortName']}
                                  </Label>
                                )
                              })
                        : false}
                    {whoAmI['roles']
                        ? ifRole(whoAmI['roles'], 'Maintainer') ===
                            'IS_ACTIVE' &&
                            <Fragment>
                              <List.Header styleName='inline.margin-top-half'>
                                Change
                              </List.Header>
                              <Dropdown
                                styleName='inline.margin-top-half'
                                fluid
                                placeholder='Change Assignees'
                                selection
                                multiple
                                search
                                onChange={this.handleChange}
                                options={
                                  maintainers
                                    ? maintainers.map(maintainer => {
                                      return maintainer['person'][
                                          'displayPicture'
                                        ]
                                          ? {
                                            text: maintainer['person'][
                                                'shortName'
                                              ],
                                            value: maintainer['id'],
                                            image: {
                                              avatar: true,
                                              src: maintainer['person'][
                                                  'displayPicture'
                                                ]
                                            }
                                          }
                                          : {
                                            text: maintainer['person'][
                                                'shortName'
                                              ],
                                            value: maintainer['id'],
                                            icon: 'user'
                                          }
                                    })
                                    : []
                                }
                              />
                            </Fragment>
                        : false}
                  </List.Content>
                </List.Item>
                : false
            : false}
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

export default connect(mapStateToProps, mapDispatchToProps)(SideSegment)
