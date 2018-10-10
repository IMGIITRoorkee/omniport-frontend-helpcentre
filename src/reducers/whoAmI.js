const whoAmI = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    default:
      return state
  }
}
export default whoAmI
