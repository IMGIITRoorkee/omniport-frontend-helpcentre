import React, { Component } from 'react'
import {
  Button,
  Form,
  TextArea,
  Dropdown,
  Divider,
  Segment,
  Image,
  Dimmer,
  Card,
  Icon,
  Header,
  Label
} from 'semantic-ui-react'
import { connect } from 'react-redux'

import { addIssue } from '../actions'
import inline from 'formula_one/src/css/inline.css'

const AppOptions = [
  { key: '1', value: 'App1', text: 'App 1' },
  {
    key: '2',
    value: 'App2',
    text: 'App2'
  },
  { key: '3', value: 'App3', text: 'App 3' }
]

class AddQuery extends Component {
  constructor (props) {
    super(props)
    this.state = {
      subject: '',
      text: '',
      app: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    const name = e.target.name
    this.setState({
      [name]: e.target.value
    })
  }

  fileChange = e => {
    this.setState({
      [e.target.name]: e.target.files[0],
      fileSrc: e.target.files[0]
        ? URL.createObjectURL(e.target.files[0])
        : null
    })
  }
  removeImage = () => {
    this.setState({
      uploadedFile: '',
      active: 0,
      fileSrc: ''
    })
  }
  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })
  handleDropdownChange = (e, { name, value }) =>
    this.setState({ [name]: value })

  handleSubmit () {
    const { subject, text, app, uploadedFile } = this.state
    if (this.state.text && this.state.app && this.state.subject) {
      var formData = new FormData()
      formData.append('title', subject)
      formData.append('app_name', app)
      formData.append('query', text)
      uploadedFile ? formData.append('uploaded_file', uploadedFile) : void 0
      this.props.AddIssue(
        formData,
        this.props.paginationIndex['index'],
        this.props.paginationIndex['status']
      )
      this.setState({
        text: '',
        subject: '',
        app: null,
        file: {},
        fileSrc: ''
      })
    }
  }

  render () {
    const { active, text, app, fileSrc, subject, uploadedFile } = this.state
    const content = (
      <div>
        <Button
          circular
          basic
          color='red'
          icon='close'
          onClick={this.removeImage}
        />
      </div>
    )
    return (
      <React.Fragment>
        <Segment.Group>
          <Segment secondary textAlign='center'>
            <Header as={'h3'}>How can we help you?</Header>
          </Segment>
          <Segment>
            <Form encType='multiple/form-data'>
              <Form.Field>
                <label>App</label>
                <Dropdown
                  selectOnNavigation={false}
                  selection
                  onChange={this.handleDropdownChange}
                  name='app'
                  placeholder='Select an App'
                  options={AppOptions}
                  value={app}
                />
              </Form.Field>
              <Form.Field>
                <label>Subject</label>
                <Form.Input
                  autoComplete='off'
                  type='input'
                  value={subject}
                  onChange={this.handleChange}
                  name='subject'
                  required
                  placeholder='Subject'
                />
              </Form.Field>
              <Form.Field>
                <label>Add Query</label>
                <TextArea
                  value={text}
                  onChange={this.handleChange}
                  name='text'
                  rows='3'
                  autoHeight
                  required
                  placeholder='Add Query'
                />
              </Form.Field>
              <label htmlFor='uploadPhoto'>
                <Button as='a' icon labelPosition='left' primary>
                  Upload
                  <Icon name='upload' />
                </Button>
              </label>
              <input
                type='file'
                onChange={this.fileChange}
                name={'uploadedFile'}
                id='uploadPhoto'
                styleName='inline.display-none'
              />
              <br />
              {fileSrc
                ? uploadedFile['type'].includes('image')
                    ? <Card>
                      <Dimmer.Dimmable
                        blurring
                        as={Image}
                        src={fileSrc}
                        size='medium'
                        dimmer={{ active, content }}
                        onMouseEnter={this.handleShow}
                        onMouseLeave={this.handleHide}
                        />
                    </Card>
                    : <div>
                      <Label>
                        <a href={fileSrc} target='blank'>
                          {uploadedFile['name']}
                        </a>
                        {' '}
                        <span
                          onClick={this.removeImage}
                          styleName='inline.cursor-pointer'
                          >
                          <Icon name='close' />
                        </span>
                      </Label>
                    </div>
                : false}
              <Divider />
              <Button
                type='submit'
                onClick={this.handleSubmit}
                position='right'
                positive
                disabled={!text || !app || !subject}
              >
                Submit
              </Button>
            </Form>
          </Segment>
        </Segment.Group>
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user,
    paginationIndex: state.paginationIndex,
    whoAmI: state.whoAmI
  }
}

const mapDispatchToProps = dispatch => {
  return {
    AddIssue: (data, index, status) => {
      dispatch(addIssue(data, index, status))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddQuery)
