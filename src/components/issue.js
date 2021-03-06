import React, { Component } from 'react'
import { ifRole } from 'formula_one'
import { connect } from 'react-redux'
import {
  Icon,
  Comment,
  Header,
  Button,
  Divider,
  Grid,
  Loader,
  Image,
  Modal,
  Label
} from 'semantic-ui-react'
import moment from 'moment'
import { isBrowser, isMobile } from 'react-device-detect'
import Emojis from 'react-emoji-component'
import { emojify } from 'react-emojione'

import CustomBreadcrumb from 'core/common/src/components/custom-breadcrumb'
import { getTheme } from 'formula_one'
import SideSegment from './side-segment'
import PostComment from './post-comment'
import {
  setActiveIssue,
  changeStatusActiveIssue,
  changeAssignees,
  getMaintainers,
  setUser
} from '../actions'
import { urlAppBase } from '../urls';

import inline from 'formula_one/src/css/inline.css'
import block from '../css/issue.css'

class IssueComment extends Component {
  render () {
    const { commenter, datetimeCreated, text } = this.props
    return (
      <Comment styleName='inline.margin-bottom-2em'>
        <Comment.Avatar src={commenter.displayPicture || '/static/helpcentre/manster.svg'} />
        <Comment.Content>
          <Comment.Author>
            {commenter['fullName']}
            {' '}
            {ifRole(commenter['roles'], 'Maintainer') === 'IS_ACTIVE'
              ? <Icon color={getTheme()} fitted name='shield' />
              : false}
          </Comment.Author>
          <Comment.Metadata>
            <span>{moment(datetimeCreated).fromNow()}</span>
          </Comment.Metadata>
          <Comment.Text styleName='inline.white-space-pre-wrap'>
            {isBrowser &&
              <Emojis size={20} hiDpi>
                {emojify(text, { output: 'unicode' })}
              </Emojis>}
            {isMobile && emojify(text, { output: 'unicode' })}
          </Comment.Text>
        </Comment.Content>
      </Comment>
    )
  }
}

class Issue extends Component {
  componentDidMount () {
    const id = this.props.match.params.id
    this.props.SetUser()
    this.props.GetMaintainers()
    this.props.SetActiveIssue(id, this.errCallback)
  }
  errCallback = (err) => {
    this.props.history.push('/404')
  }
  toggleIssue = () => {
    const { activeIssue, ChangeStatusActiveIssue } = this.props
    const id = this.props.match.params.id
    ChangeStatusActiveIssue(id, !activeIssue['isClosed'])
  }

  render () {
    const { activeIssue, whoAmI } = this.props
    const id = this.props.match.params.id
    return !activeIssue.isEmpty
      ? <div styleName='block.issue-container'>
        <CustomBreadcrumb list={[{ name: 'Helpcentre', link: urlAppBase() }, {name: `#${id}`}]} />
        <Grid textAlign='justified'>
          {isMobile &&
          <Grid.Row>
            <Grid.Column width={16}>
              <SideSegment id={id} />
            </Grid.Column>
          </Grid.Row>}
          <Grid.Row>
            <Grid.Column
              width={isBrowser ? 10 : 16}
              styleName='block.heading'
              >
              <Header as='h1'>{activeIssue['title']}</Header>
              {activeIssue.isClosed === true
                ? <Label horizontal color='green' size='small' icon='check circle' content='Resolved' /> 
                : <Label horizontal color='red' size='small' icon='exclamation circle' content='Pending' />
              }
              <span styleName='block.issue-opener'>
                {isBrowser &&
                <span>
                  <span styleName='block.user'>
                    {activeIssue['uploader']
                          ? activeIssue['uploader']['fullName']
                          : ''}
                  </span>
                  {' '} opened this query {' '}
                  {moment(activeIssue['datetimeCreated']).fromNow()}
                  {' '} in {' '}
                  {activeIssue.appName}
                  <b>{' '}·{' '}</b>
                </span>}
                {activeIssue['comments']
                    ? activeIssue['comments'].length === 1
                        ? '1 comment'
                        : `${activeIssue['comments'].length} comments`
                    : false}
              </span>
              <Divider />
              <Comment.Group>
                <Comment styleName='inline.margin-bottom-1_5em'>
                  <Comment.Avatar
                  src={activeIssue['uploader'] && activeIssue['uploader']['displayPicture'] || '/static/helpcentre/manster.svg'}
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
                      {activeIssue['uploadedFile']
                          ? RegExp('^\.jpg$|\.gif$|.png$|\.jpeg$|\.jpg$').test(
                              activeIssue['uploadedFile']
                            )
                              ? <Modal
                                dimmer='blurring'
                                trigger={
                                  <Image
                                    src={activeIssue['uploadedFile']}
                                    alt={activeIssue['id']}
                                    styleName='block.uploaded-image'
                                    />
                                  }
                                basic
                                fluid
                                closeIcon
                                >
                                <Image
                                  src={activeIssue['uploadedFile']}
                                  wrapped
                                  size={'massive'}
                                  />
                              </Modal>
                              : <p>
                                  <Button 
                                    icon='download'
                                    basic
                                    color={getTheme()}
                                    content='Download Attachment'
                                    as='a'
                                    href={activeIssue['uploadedFile']} 
                                    download 
                                  />
                                </p>
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
                    src=
                      {whoAmI['displayPicture'] || '/static/helpcentre/manster.svg'}
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
            {isBrowser &&
            <Grid.Column width={6}>
              <SideSegment id={id} />
            </Grid.Column>}
          </Grid.Row>
        </Grid>
      </div>
      : <div styleName='block.issue-container'>
        <Loader />
      </div>
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
    SetActiveIssue: (id, errCallback) => {
      dispatch(setActiveIssue(id, errCallback))
    },
    ChangeStatusActiveIssue: (id, newStatus) => {
      dispatch(changeStatusActiveIssue(id, newStatus))
    },
    ChangeAssignees: (id, assignees) => {
      dispatch(changeAssignees(id, assignees))
    },
    GetMaintainers: () => {
      dispatch(getMaintainers())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Issue)
