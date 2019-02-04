import React, { Component } from 'react'
import {
  Button,
  Form,
  TextArea,
  Dropdown,
  Segment,
  Image,
  Dimmer,
  Card,
  Icon,
  Header,
  Label,
  Message
} from 'semantic-ui-react'
import { connect } from 'react-redux'

import { getTheme } from 'formula_one'
import { addIssue, setAppList } from '../actions'

import inline from 'formula_one/src/css/inline.css'
import main from '../css/issue-list.css'

class AddQuery extends Component {
  constructor (props) {
    super(props)
    const url = new URLSearchParams(props.history.location.search)
    console.log(url.get('app') || '')
    this.state = {
      subject: '',
      text: '',
      app: url.get('app') || null,
      success: false,
      error: false,
      message: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount () {
    if (!this.props.appList.isLoaded) {
      this.props.SetAppList()
    }
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
    const url = new URLSearchParams(this.props.history.location.search)
    if (this.state.text && this.state.app) {
      var formData = new FormData()
      formData.append('title', subject)
      formData.append('app_name', app)
      formData.append('query', text)
      uploadedFile ? formData.append('uploaded_file', uploadedFile) : void 0
      this.props.AddIssue(
        formData,
        this.props.paginationIndex['index'],
        this.props.paginationIndex['status'],
        this.successCallBack,
        this.errCallback
      )
      this.setState({
        text: '',
        subject: '',
        app: url.get('app') || null,
        file: {},
        fileSrc: ''
      })
    }
  }
  successCallBack = res => {
    this.setState({
      success: true,
      error: false,
      message: res.statusText
    })
  }
  errCallBack = err => {
    this.setState({
      error: true,
      success: false,
      message: err.response.data
    })
  }

  render () {
    const { active, text, app, fileSrc, subject, uploadedFile } = this.state
    const { appList } = this.props
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
            {this.state.success && (
              <Message success={this.state.success} icon>
                <Icon name='check' />
                <Message.Content>
                  <Message.Header>Success</Message.Header>
                  Your query has been submitted.
                </Message.Content>
              </Message>
            )}
            {this.state.error && (
              <Message negative={this.state.error}>
                <Icon name='close' />
                <Message.Header>Error</Message.Header>
                <Message.List>
                  {Object.keys(this.state.message).map(cat => {
                    this.state.message[cat].map(item => {
                      return <Message.Item>{item}</Message.Item>
                    })
                  })}
                </Message.List>
              </Message>
            )}
            <Form encType='multiple/form-data'>
              <Form.Field>
                <label>App</label>
                <Dropdown
                  selectOnNavigation={false}
                  selection
                  onChange={this.handleDropdownChange}
                  name='app'
                  placeholder='Select an App'
                  options={[
                    ...appList.data.map((app, index) => {
                      const option = {
                        key: index,
                        value: app.nomenclature.verboseName,
                        text: app.nomenclature.verboseName
                      }
                      if (app.assets.favicon) {
                        option['image'] = {
                          src: `/static/${app.baseUrls.static}${
                            app.assets.favicon
                          }`,
                          style: {
                            height: '16px',
                            width: '16px',
                            verticalAlign: 'middle'
                          }
                        }
                      } else {
                        option['icon'] = 'cube'
                      }
                      return option
                    }),
                    { value: 'Other', text: 'Other', icon: 'cube' }
                  ]}
                  value={app}
                  error={
                    this.state.error &&
                    Object.key(this.state.message).find(x => {
                      return x === 'app'
                    })
                  }
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
                  placeholder='Subject'
                  error={
                    this.state.error &&
                    Object.key(this.state.message).find(x => {
                      return x === 'subject'
                    })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Add query</label>
                <TextArea
                  value={text}
                  onChange={this.handleChange}
                  name='text'
                  rows='3'
                  autoHeight
                  placeholder='Add Query'
                  error={
                    this.state.error &&
                    Object.key(this.state.message).find(x => {
                      return x === 'text'
                    })
                  }
                />
              </Form.Field>
              <p>
                To attach more than one file, upload a <i>.zip</i> archive.
              </p>
              <label htmlFor='uploadPhoto'>
                <Button
                  as='span'
                  icon='upload'
                  content='Upload'
                  basic
                  color={getTheme()}
                  styleName='inline.margin-bottom-1em'
                />
              </label>
              <input
                type='file'
                onChange={this.fileChange}
                name={'uploadedFile'}
                id='uploadPhoto'
                styleName='inline.display-none'
              />
              {fileSrc ? (
                uploadedFile['type'].includes('image') ? (
                  <Card>
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
                ) : (
                  <div>
                    <Label>
                      <a href={fileSrc} target='blank'>
                        {uploadedFile['name']}
                      </a>{' '}
                      <span
                        onClick={this.removeImage}
                        styleName='inline.cursor-pointer'
                      >
                        <Icon name='close' />
                      </span>
                    </Label>
                  </div>
                )
              ) : (
                false
              )}
              <br />
              <div styleName='main.button-container'>
                <Button
                  type='submit'
                  onClick={this.handleSubmit}
                  position='right'
                  primary
                  icon='send'
                  content='Submit'
                  disabled={!text || !app || !subject}
                />
              </div>
            </Form>
          </Segment>
        </Segment.Group>
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    paginationIndex: state.paginationIndex,
    whoAmI: state.whoAmI,
    appList: state.appList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    AddIssue: (data, index, status, successCallBack, errCallback) => {
      dispatch(addIssue(data, index, status, successCallBack, errCallback))
    },
    SetAppList: () => {
      dispatch(setAppList())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddQuery)
