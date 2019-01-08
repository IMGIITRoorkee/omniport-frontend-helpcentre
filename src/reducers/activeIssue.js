const activeIssue = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVEISSUE':
      return action.payload
    case 'CHANGE_STATUS_ACTIVEISSUE':
      return { ...state, isClosed: action.payload }
    case 'CHANGE_ASSIGNEES_ACTIVEISSUE':
      return { ...state, assignees: action.payload }
    case 'ADD_COMMENT':
      return { ...state, comments: [...state['comments'], action.payload] }
    case 'ADD_COMMENT_CHANGE_STATUS':
      return {
        ...state,
        comments: [...state['comments'], action.payload['comment']],
        isClosed: action.payload['status']
      }
    default:
      return state
  }
}

export default activeIssue
