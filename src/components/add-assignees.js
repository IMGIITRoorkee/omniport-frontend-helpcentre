import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Form, Search, Icon } from 'semantic-ui-react'
import { debounce } from 'lodash'

import { changeAssignees } from '../actions'
import { UserCard } from 'formula_one'
import { urlSearchMaintainer } from '../urls'

import inline from 'formula_one/src/css/inline.css'

class AddAssignees extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      value: '',
      results: []
    }
  }
  handleSearchChange = value => {
    this.setState({
      value: value,
      isLoading: Boolean(value)
    })
    if (value) {
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
  }
  handleResultSelect = (e, { result }) => {
    const { activeIssue } = this.props
    const data = [
      ...activeIssue.assignees.map(x => {
        return x.id ? x.id : x
      }),
      result.person.id
    ]
    this.props.ChangeAssignees(activeIssue.id, data)
  }
  render () {
    const { isLoading, results } = this.state
    const { activeIssue } = this.props
    const resultRenderer = ({ person }) => (
      <UserCard
        key={person.id}
        name={person.person.fullName}
        image={person.person.displayPicture}
        right={
          activeIssue.assignees.find(x => {
            return x.id ? x.id === person.id : x === person.id
          }) && <Icon name='check' color='green' />
        }
      />
    )
    return (
      <React.Fragment>
        <Form styleName='inline.margin-top-half'>
          <Form.Field>
            <Search
              loading={isLoading || !activeIssue.assignees}
              onSearchChange={debounce(
                (e, { value }) => this.handleSearchChange(value),
                500
              )}
              onResultSelect={this.handleResultSelect}
              results={results}
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
    ChangeAssignees: (id, assignees) => {
      dispatch(changeAssignees(id, assignees))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAssignees)
