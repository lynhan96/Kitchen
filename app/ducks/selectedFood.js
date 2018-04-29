import { ADMIN_SIGNED_OUT } from 'ducks/admin'

export const CHANGE_SELECTED = 'CHANGE_SELECTED'

export const updateSelectedFood = items => dispatch => {
  dispatch({type: CHANGE_SELECTED, items: items})
}

const initialState = {
  items: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SELECTED:
      return {
        ...state,
        items: action.items
      }

    case ADMIN_SIGNED_OUT:
      return {...initialState}
    default:
      return state
  }
}

export default reducer
