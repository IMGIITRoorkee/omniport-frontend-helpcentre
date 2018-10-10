import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Pagination } from 'semantic-ui-react'

import { setIssueList, changePage, setUser, setStatusNumbers } from '../actions'

class TabPagination extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.SetUser()
    this.props.SetStatusNumbers()
    this.props.SetIssueList(1, 'opened')
  }

  handlePageChange = (event, data) => {
    this.props.ChangePage(data['activePage'], this.props.page['status'])
    this.props.SetIssueList(data['activePage'], this.props.page['status'])
  }

  render () {
    return (
      <Pagination
        activePage={this.props.page['index'] && this.props.page['index']}
        totalPages={
          this.props.issueList
            ? Math.ceil(this.props.issueList['count'] / 10)
            : '1'
        }
        onPageChange={this.handlePageChange}
        firstItem={{ 'aria-label': 'First item', content: 'First', key: '1' }}
        lastItem={{ 'aria-label': 'Last item', content: 'Last', key: '2' }}
        nextItem={{ 'aria-label': 'Next item', content: 'Next', key: '3' }}
        prevItem={{
          'aria-label': 'Previous item',
          content: 'Previous',
          key: '4'
        }}
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

export default connect(mapStateToProps, mapDispatchToProps)(TabPagination)
