const maintainers = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_MAINTAINERS':
      return action.payload
    default:
      return state
  }
}

export default maintainers
