const initialState = {
  isLoaded: false,
  data: {}
}
const allowsPolyjuice = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ALLOWS_POLYJUICE':
      return action.payload
    default:
      return state
  }
}

export default allowsPolyjuice
