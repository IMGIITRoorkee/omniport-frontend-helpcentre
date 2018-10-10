import React, { Component, Fragment } from 'react'
import { ifRole } from 'formula_one/src/utils'
import { connect } from 'react-redux'
import {
  Icon,
  Comment,
  Header,
  Button,
  Divider,
  Grid,
  Sticky,
  Popup,
  Loader,
  Image,
  Card,
  Modal,
  Label
} from 'semantic-ui-react'
import moment from 'moment'

import SideSegment from './side-segment'
import PostComment from './post-comment'
import {
  setActiveIssue,
  changeStatusActiveIssue,
  changeAssignee,
  getMaintainers,
  setUser
} from '../actions'
import inline from 'formula_one/src/css/inline.css'
import block from '../css/issue.css'

class IssueComment extends Component {
  render () {
    const { commenter, datetimeCreated, text } = this.props
    return (
      <Comment styleName='inline.margin-bottom-2em'>
        <Comment.Avatar src={commenter['displayPicture']} />
        <Comment.Content>
          <Comment.Author>
            {commenter['fullName']}
            {' '}
            {ifRole(commenter['roles'], 'Maintainer') === 'IS_ACTIVE'
              ? <Icon color='blue' fitted name='shield' />
              : false}
          </Comment.Author>
          <Comment.Metadata>
            <span>{moment(datetimeCreated).fromNow()}</span>
          </Comment.Metadata>
          <Comment.Text styleName='inline.white-space-pre-wrap'>{text}</Comment.Text>
        </Comment.Content>
      </Comment>
    )
  }
}

class Issue extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    const id = this.props.match.params.id
    this.props.SetUser()
    this.props.GetMaintainers()
    this.props.SetActiveIssue(id)
  }

  toggleIssue = () => {
    const { activeIssue, ChangeStatusActiveIssue } = this.props
    const id = this.props.match.params.id
    ChangeStatusActiveIssue(id, !activeIssue['isClosed'])
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render () {
    const { contextRef } = this.state
    const { activeIssue, whoAmI } = this.props
    const id = this.props.match.params.id
    return activeIssue
      ? <div styleName='block.issue-container' ref={this.handleContextRef}>
        <Grid textAlign='justified'>
          <Grid.Row>
            <Grid.Column width={10} styleName='block.heading'>
              <Header as='h1'>{activeIssue['title']}</Header>
              {activeIssue.isClosed === true
                  ? <Popup
                    trigger={
                      <Button positive size='small' basic>
                        <Icon name='exclamation circle' />Resolved
                        </Button>
                      }
                    content={
                      <Button
                        negative
                        size='small'
                        onClick={this.toggleIssue}
                        >
                        <Icon name='exclamation circle' />Mark Pending
                        </Button>
                      }
                    on='click'
                    position='left center'
                    />
                  : <Popup
                    trigger={
                      <Button negative size='small' basic>
                        <Icon name='exclamation circle' />Pending
                        </Button>
                      }
                    content={
                      <Button
                        positive
                        size='small'
                        onClick={this.toggleIssue}
                        >
                        <Icon name='exclamation circle' />Mark Resolved
                        </Button>
                      }
                    on='click'
                    position='left center'
                    />}
              <span styleName='block.issue-opener'>
                <span styleName='block.user'>
                  {activeIssue['uploader']
                      ? activeIssue['uploader']['fullName']
                      : ''}
                </span>
                {' '}
                  opened this query
                  {' '}
                {moment(activeIssue['datetimeCreated']).fromNow()}
                {' '}
                  in
                  {' '}
                {activeIssue.appName}
                <b>{' '}·</b>
                {' '}
                {activeIssue['comments'] ? activeIssue['comments'].length : 0}
                {' '}
                  comments
                </span>
              <Divider />
              <Comment.Group>
                <Comment styleName='inline.margin-bottom-1_5em'>
                  <Comment.Avatar
                    src={
                        activeIssue['uploader'] &&
                          activeIssue['uploader']['displayPicture']
                      }
                    />
                  <Comment.Content>
                    <Comment.Author>
                      {activeIssue['uploader'] &&
                          activeIssue['uploader']['fullName']}
                    </Comment.Author>
                    <Comment.Metadata>
                      <span>
                        {moment(activeIssue['datetimeCreated']).fromNow()}
                      </span>
                    </Comment.Metadata>
                    <Comment.Text styleName='inline.white-space-pre-wrap'>
                      {activeIssue['query']}
                      {activeIssue['uploadedFile'] ?
                          (RegExp('^\.|\.jpg$|\.gif$|.png$').test(activeIssue['uploadedFile']))
                          ? <Modal
                            dimmer='blurring'
                            trigger={
                              <Card
                                image={activeIssue['uploadedFile']}
                                alt={activeIssue['id']}
                                />
                              }
                            basic
                            fluid
                            >
                            <Image
                              src={activeIssue['uploadedFile']}
                              wrapped
                              size={'massive'}
                              />
                          </Modal>
                          : <div>
                            <a
                              href={activeIssue['uploadedFile']}
                              target='blank'
                              >
                              <Icon name='download' color={'blue'} />
                              {' '}
                                Download Attachment
                              </a>
                          </div>
                          : null}
                    </Comment.Text>
                  </Comment.Content>
                </Comment>
                {activeIssue['comments'] &&
                    activeIssue['comments'].map(comment => {
                      return (
                        <IssueComment
                          key={comment.id}
                          commenter={comment['commenter']}
                          datetimeCreated={comment['datetimeCreated']}
                          text={comment['text']}
                        />
                      )
                    })}
                <Comment>
                  <Comment.Avatar
                    src={whoAmI ? whoAmI['displayPicture'] : ''}
                    />
                  <Comment.Content>
                    <Comment.Author>
                      {whoAmI ? whoAmI['fullName'] : ''}
                    </Comment.Author>
                    <PostComment
                      queryId={id}
                      isClosed={activeIssue.isClosed}
                      />
                  </Comment.Content>
                </Comment>
              </Comment.Group>
            </Grid.Column>
            <Grid.Column width={6}>
              <Sticky context={contextRef} offset={25}>
                <SideSegment id={id} />
              </Sticky>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      : <div styleName='block.issue-container' ref={this.handleContextRef}>
        <Loader />
      </div>
  }
}

function mapStateToProps (state) {
  return {
    queries: state.queries,
    user: state.user,
    comments: state.comments,
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
export default connect(mapStateToProps, mapDispatchToProps)(Issue)
