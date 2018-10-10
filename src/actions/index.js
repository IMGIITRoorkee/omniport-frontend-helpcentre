import axios from 'axios'

// import urls
import { urlWhoAmI, urlGetMaintainers } from 'formula_one/src/urls'
import { urlQueries, urlQueryDetails, urlComments } from '../urls'
import { getCookie } from 'formula_one/src/utils'

export const setUser = () => {
  return dispatch => {
    axios
      .get(urlWhoAmI())
      .then(res => {
        dispatch({
          type: 'SET_USER',
          payload: res.data
        })
      })
      .catch(err => {
        window.location.replace('/rest/login')
      })
  }
}

// IssueList actions start
export const setIssueList = (id, status) => {
  return dispatch => {
    id = Math.ceil(id)
    axios
      .get(urlQueries(), {
        params: {
          page: id,
          status: status
        }
      })
      .then(res => {
        dispatch({
          type: 'GET_ISSUELIST',
          payload: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
}

// Pagination
export const changePage = (index, status) => {
  return {
    type: 'CHANGE_PAGE',
    payload: { index: index, status: status }
  }
}
// Pagination

// IssueList actions end

// PostIssue actions start
export const addIssue = (data, index, status) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    axios.post(urlQueries(), data, { headers: headers }).then(res => {
      dispatch(setIssueList(index, status))
    })
  }
}
// PostIssue actions end

// Maintainers List start
export const getMaintainers = () => {
  return dispatch => {
    axios
      .get(urlGetMaintainers())
      .then(res => {
        dispatch({
          type: 'UPDATE_MAINTAINERS',
          payload: res.data
        })
      })
      .catch(err => {})
  }
}
// Maintainers list ends

// Issue actions start
export const setActiveIssue = id => {
  return dispatch => {
    axios.get(urlQueryDetails(id)).then(res => {
      dispatch({
        type: 'SET_ACTIVEISSUE',
        payload: res.data
      })
    })
  }
}

export const changeStatusActiveIssue = (id, newstatus) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  let data = {
    id: id,
    is_closed: newstatus
  }
  return dispatch => {
    axios.patch(urlQueryDetails(id), data, { headers: headers }).then(res => {
      res.status == 200
        ? dispatch({
          type: 'CHANGE_STATUS_ACTIVEISSUE',
          payload: res.data['isClosed']
        })
        : void 0
    })
  }
}

export const changeAssignee = (id, newAssignees) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  let data = {
    id: id,
    assignee: newAssignees
  }
  return dispatch => {
    axios.patch(urlQueryDetails(id), data, { headers: headers }).then(res => {
      res.status == 200
        ? dispatch({
          type: 'CHANGE_ASSIGNEE_ACTIVEISSUE',
          payload: res.data['assignee']
        })
        : void 0
    })
  }
}

// Add Comments start
export const addComment = (id, text) => {
  let data = {
    query_id: id,
    text: text,
    attachment: null
  }
  let headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    axios.post(urlComments(), data, { headers: headers }).then(res => {
      res.status < 300
        ? dispatch({
          type: 'ADD_COMMENT',
          payload: res.data
        })
        : void 0
    })
  }
}

export const addCommentChangeStatus = (id, text, newStatus) => {
  let data = {
    query_id: id,
    text: text,
    attachment: null
  }
  let headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    axios.post(urlComments(), data, { headers: headers }).then(res => {
      res.status < 300
        ? dispatch(changeStatus(id, newStatus, res.data))
        : void 0
    })
  }
}

const changeStatus = (id, newStatus, commentData) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  let data = {
    id: id,
    is_closed: newStatus
  }
  return dispatch => {
    axios.patch(urlQueryDetails(id), data, { headers: headers }).then(res => {
      res.status == 200
        ? dispatch({
          type: 'ADD_COMMENT_CHANGE_STATUS',
          payload: {
            comment: commentData,
            status: res.data['isClosed']
          }
        })
        : void 0
    })
  }
}
// Add Comments Ends

// Issue action ends

// Issue stats actiona
const getOpenedIssueNumber = () => {
  return axios.get(urlQueries(), {
    params: {
      page: 1,
      status: 'opened'
    }
  })
}

const getClosedIssueNumber = () => {
  return axios.get(urlQueries(), {
    params: {
      page: 1,
      status: 'closed'
    }
  })
}

const getAssignedIssueNumber = () => {
  return axios.get(urlQueries(), {
    params: {
      page: 1,
      status: 'assigned'
    }
  })
}

export const setStatusNumbers = () => {
  return dispatch => {
    axios
      .all([
        getOpenedIssueNumber(),
        getClosedIssueNumber(),
        getAssignedIssueNumber()
      ])
      .then(
        axios.spread((open, close, assign) => {
          dispatch({
            type: 'SET_NUMBER',
            payload: {
              open: open.data['count'],
              close: close.data['count'],
              assign: assign.data['count']
            }
          })
        })
      )
  }
}