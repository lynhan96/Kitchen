import {
  FETCH_FOOD_SORT_VALUE,
  FETCH_FOOD_SEARCH_VALUE,
  FETCH_FOOD_TOTAL_PAGE
} from 'lib/actions/foodOrderHistory'

import { ADMIN_SIGNED_OUT } from 'ducks/admin'

const initialState = {
  totalPage: 0,
  sortBy: 'id',
  sortType: 'AtoZ',
  keyWord: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FOOD_SORT_VALUE:
      return {
        ...state,
        sortBy: action.sortBy,
        sortType: action.sortType
      }

    case FETCH_FOOD_TOTAL_PAGE:
      return {
        ...state,
        totalPage: action.totalPage
      }

    case FETCH_FOOD_SEARCH_VALUE:
      return {
        ...state,
        keyWord: action.keyWord
      }

    case ADMIN_SIGNED_OUT:
      return {...initialState}
    default:
      return state
  }
}

export default reducer
