const initialState = {
  open: 0,
  close: 0,
  assign: 0
}
const statusNumbers = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NUMBER':
      return action.payload
    default:
      return state
  }
}

export default statusNumbers
