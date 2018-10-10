const initialState = {
  index: 1,
  status: 'opened'
}
const pagination = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_PAGE':
      return action.payload
    default:
      return state
  }
}

export default pagination
