const issueList = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ISSUELIST':
      return action.payload
    default:
      return state
  }
}

export default issueList
