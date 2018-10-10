import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button, TextArea } from 'semantic-ui-react'

import { addComment, addCommentChangeStatus } from '../actions'
import inline from 'formula_one/src/css/inline.css'

class PostComment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      closed: this.props.isClosed
    }
  }

  componentDidMount () {}

  handleChange = e => {
    const name = e.target.name
    this.setState({
      [name]: e.target.value
    })
  }
  comment = () => {
    this.props.AddComment(this.props.queryId, this.state.text)
    this.setState({
      text: ''
    })
  }
  commentChangeStatus = () => {
    this.props.AddCommentChangeStatus(
      this.props.queryId,
      this.state.text,
      !this.props.activeIssue['isClosed']
    )
    this.setState({
      text: ''
    })
  }

  render () {
    const { text } = this.state
    return (
      <Form encType='multiple/form-data'>
        <TextArea
          placeholder='Add a comment to thread...'
          rows={3}
          autoHeight
          name='text'
          value={text}
          onChange={this.handleChange}
          styleName='inline.margin-bottom-half'
        />
        <Button.Group floated='right'>
          <Button
            styleName='inline.margin-right-half'
            onClick={this.commentChangeStatus}
            disabled={this.props.activeIssue['isClosed'] || !text}
          >
            Close issue
          </Button>
          <Button primary onClick={this.comment} disabled={!text}>
            Comment
          </Button>
        </Button.Group>
      </Form>
    )
  }
}

function mapStateToProps (state) {
  return {
    whoAmI: state.whoAmI,
    activeIssue: state.activeIssue
  }
}

const mapDispatchToProps = dispatch => {
  return {
    AddComment: (id, text) => {
      dispatch(addComment(id, text))
    },
    AddCommentChangeStatus: (id, text, newStatus) => {
      dispatch(addCommentChangeStatus(id, text, newStatus))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(PostComment)
