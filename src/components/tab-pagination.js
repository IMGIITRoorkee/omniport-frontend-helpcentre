import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Input, Pagination } from 'semantic-ui-react'
import { MobileView, BrowserView } from 'react-device-detect'

import { setIssueList, changePage, setUser, setStatusNumbers } from '../actions'

class TabPagination extends Component {
  componentDidMount () {
    this.props.SetUser()
    this.props.SetStatusNumbers()
    this.props.SetIssueList(1, 'opened')
  }

  handleRef = c => {
    this.inputRef = c
  }

  handlePageChange = (event, data) => {
    this.props.ChangePage(data['activePage'], this.props.page['status'])
    this.props.SetIssueList(data['activePage'], this.props.page['status'])
  }

  handleInputChange = event => {
    this.props.ChangePage(event.target.value, this.props.page['status'])
    this.props.SetIssueList(event.target.value, this.props.page['status'])
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.props.ChangePage(event.target.value, this.props.page['status'])
      this.props.SetIssueList(event.target.value, this.props.page['status'])
      this.inputRef.blur()
    }
  }
  render () {
    return (
      <React.Fragment>
        <BrowserView>
          <Pagination
            activePage={this.props.page['index'] && this.props.page['index']}
            totalPages={
              this.props.issueList
                ? Math.ceil(this.props.issueList['count'] / 10)
                : '1'
            }
            onPageChange={this.handlePageChange}
            firstItem={{
              'aria-label': 'First item',
              content: <Icon name='angle double left' />,
              key: '1'
            }}
            prevItem={{
              'aria-label': 'Previous item',
              content: <Icon name='angle left' />,
              key: '4'
            }}
            nextItem={{
              'aria-label': 'Next item',
              content: <Icon name='angle right' />,
              key: '3'
            }}
            lastItem={{
              'aria-label': 'Last item',
              content: <Icon name='angle double right' />,
              key: '2'
            }}
          />
        </BrowserView>
        <MobileView>
          <Input
            placeholder={this.props.page['index'] && this.props.page['index']}
            style={{ width: '4em' }}
            onKeyPress={this.handleKeyPress}
            ref={this.handleRef}
          />
          {' of '}
          {this.props.issueList
            ? Math.ceil(this.props.issueList['count'] / 10)
            : '1'}
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

export default connect(mapStateToProps, mapDispatchToProps)(TabPagination)
