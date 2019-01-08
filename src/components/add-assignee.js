import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Form, Search, Icon } from 'semantic-ui-react'

import { changeAssignee } from '../actions'
import { getTheme, UserCard } from 'formula_one'
import { urlSearchMaintainer } from '../urls'

import inline from 'formula_one/src/css/inline.css'

class AddAssignee extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      value: '',
      results: []
    }
  }
  handleSearchChange = (e, { value }) => {
    this.setState({
      value: value,
      isLoading: true
    })
    axios
      .get(urlSearchMaintainer(), { params: { search: value } })
      .then(res => {
        this.setState({
          results: res.data.slice(0, 3).map(person => {
            return { person, title: person.person.fullName }
          }),
          isLoading: false
        })
      })
  }
  handleResultSelect = (e, { result }) => {
    const { activeIssue } = this.props
    const data = [...activeIssue.assignee.map(x => x.id), result.person.id]
    this.props.ChangeAssignee(activeIssue.id, data)
  }
  render () {
    const { isLoading, value, results } = this.state
    const { activeIssue } = this.props
    const resultRenderer = ({ person, title }) => (
      <UserCard
        key={person.id}
        name={person.person.fullName}
        image={person.person.displayPicture}
        right={
          activeIssue.assignee.find(x => {
            return x.id === person.id
          }) && <Icon name='check' color='green' />
        }
      />
    )
    return (
      <React.Fragment>
        <Form styleName='inline.margin-top-half'>
          <Form.Field>
            <Search
              loading={isLoading || !activeIssue.assignee}
              onSearchChange={this.handleSearchChange}
              onResultSelect={this.handleResultSelect}
              results={results}
              value={value}
              fluid
              input={{ fluid: true }}
              resultRenderer={resultRenderer}
              placeholder='Add members by their name or contact information'
            />
          </Form.Field>
        </Form>
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    maintainers: state.maintainers,
    activeIssue: state.activeIssue
  }
}
const mapDispatchToProps = dispatch => {
  return {
    ChangeAssignee: (id, assignees) => {
      dispatch(changeAssignee(id, assignees))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAssignee)
