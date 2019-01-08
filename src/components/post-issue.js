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
  Label
} from 'semantic-ui-react'
import { connect } from 'react-redux'

import { getTheme } from 'formula_one'
import { addIssue, setAppList } from '../actions'

import inline from 'formula_one/src/css/inline.css'
import main from '../css/issue-list.css'

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
                />
              </Form.Field>
              <p>
                To attach more than one file, upload a <i>.zip</i> archive.
              </p>
              <label htmlFor='uploadPhoto'>
                <Button
                  as='span'
                  icon
                  labelPosition='left'
                  color={getTheme()}
                  styleName='inline.margin-bottom-1em'
                >
                  <Icon name='upload' />
                  Upload
                </Button>
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
                  positive
                  icon
                  labelPosition='left'
                  disabled={!text || !app || !subject}
                >
                  <Icon name='send' />
                  Submit
                </Button>
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
    AddIssue: (data, index, status) => {
      dispatch(addIssue(data, index, status))
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
