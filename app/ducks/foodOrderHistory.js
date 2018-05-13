import {
  FETCH_SORT_VALUE,
  FETCH_SEARCH_VALUE,
  FETCH_TOTAL_PAGE,
  FETCH_FILTER_TABLE,
  FETCH_FILTER_STATUS
} from 'lib/actions/foodOrderHistory'

import { ADMIN_SIGNED_OUT } from 'ducks/admin'

const initialState = {
  totalPage: 0,
  filterTable: 'Tất cả',
  filterStatus: 'Tất cả',
  sortBy: 'time',
  sortType: 'ZtoA',
  keyWord: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SORT_VALUE:
      return {
        ...state,
        sortBy: action.sortBy,
        sortType: action.sortType
      }

    case FETCH_FILTER_TABLE:
      return {
        ...state,
        filterTable: action.filterTable
      }

    case FETCH_FILTER_STATUS:
      return {
        ...state,
        filterStatus: action.filterStatus
      }

    case FETCH_TOTAL_PAGE:
      return {
        ...state,
        totalPage: action.totalPage
      }

    case FETCH_SEARCH_VALUE:
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
