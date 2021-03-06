import React, { Component } from 'react'
import { BrowserRouter as Route, Router, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Grid, Header, List, Segment, Placeholder } from 'semantic-ui-react'
import moment from 'moment'

import CustomBreadcrumb from 'core/common/src/components/custom-breadcrumb'
import { NonMaintainerView } from 'formula_one'
import TabStatus from './tab-status'
import TabPagination from './tab-pagination'
import PostIssue from './post-issue'
import { setIssueList, changePage, setUser, setStatusNumbers } from '../actions'
import inline from 'formula_one/src/css/inline.css'
import block from '../css/issue-list.css'

class IssueBar extends Component {
  render () {
    const {
      id,
      isClosed,
      title,
      datetimeCreated,
      fullName,
      appName
    } = this.props
    return (
      <Link to={`/helpcentre/issue/${id}`}>
        <Segment
          color={isClosed === true ? 'green' : 'red'}
          styleName='inline.margin-half inline.margin-top-1em'
        >
          <List>
            <List.Item>
              <List.Icon
                color={isClosed === true ? 'green' : 'red'}
                name={isClosed === true ? 'check' : 'exclamation circle'}
                verticalAlign='middle'
              />
              <List.Content>
                <List.Header>{title}</List.Header>
                <List.Description styleName='inline.color-586069'>
                  {'opened '}
                  {moment(datetimeCreated).fromNow()}
                  {' by '}
                  <span styleName='inline.font-weight-bold'>{fullName}</span>
                  {' in '}
                  <span styleName='inline.font-weight-bold'>{appName}</span>.
                </List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
      </Link>
    )
  }
}

class IssueList extends Component {
  componentDidMount () {
    this.props.SetStatusNumbers()
    this.props.SetIssueList(1, 'opened')
    this.props.SetUser()
  }

  createList () {
    const { issueList } = this.props
    return issueList['results']
      ? issueList['results'].slice(0).map(issue => {
        return (
          <IssueBar
            id={issue.id}
            isClosed={issue.isClosed}
            title={issue.title}
            datetimeCreated={issue['datetimeCreated']}
            fullName={issue['uploader']['fullName']}
            appName={issue.appName}
            key={issue.id}
          />
        )
      })
      : [...Array(6)].map((item, index) => {
        return (
          <Segment>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
            </Placeholder>
          </Segment>
        )
      })
  }

  render () {
    const { whoAmI } = this.props
    return (
      <div ref={this.handleContextRef}>
        <CustomBreadcrumb list={[{ name: 'Helpcentre' }]} />
        <Grid textAlign='justified'>
          <Grid.Row centered>
            <Grid.Column>
              <NonMaintainerView which='helpcentre'>
                <PostIssue history={this.props.history} />
              </NonMaintainerView>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column>
              <Segment.Group>
                <Segment>
                  <Header as={'h4'}>Issues</Header>
                </Segment>
                <TabStatus />
                {this.createList()}
                <Segment secondary textAlign={'right'}>
                  <TabPagination />
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
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
      dispatch(setUser())
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
)(IssueList)
