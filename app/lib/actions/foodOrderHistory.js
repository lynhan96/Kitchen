import R from 'ramda'
import { sortObjectsByKeyAtoZ, sortObjectsByKeyZtoA, checkKeyword } from 'lib/objects'
import { getTableState } from 'lib/Constant'

export const FETCH_SORT_VALUE = 'FETCH_SORT_VALUE'
export const FETCH_SEARCH_VALUE = 'FETCH_SEARCH_VALUE'
export const FETCH_TOTAL_PAGE = 'FETCH_TOTAL_PAGE'
export const FETCH_FILTER_TABLE = 'FETCH_FILTER_TABLE'
export const FETCH_FILTER_STATUS = 'FETCH_FILTER_STATUS'

export const updateSortValue = (fieldName, sortType) => ({
  type: FETCH_SORT_VALUE,
  sortType: sortType,
  sortBy: fieldName
})

export const updateTotalPage = totalPage => ({
  type: FETCH_TOTAL_PAGE,
  totalPage: totalPage
})

export const updateKeyWord = keyWord => ({
  type: FETCH_SEARCH_VALUE,
  keyWord: keyWord
})

export const updateFilterTable = value => ({
  type: FETCH_FILTER_TABLE,
  filterTable: value
})

export const updateFilterStatus = value => ({
  type: FETCH_FILTER_STATUS,
  filterStatus: value
})

export const preapreFoodOrderHistory = (orderData, dispatch, foodOrderHistoryState) => {
  const datas = R.values(orderData)
  const tableData = getTableState().items
  const { sortType, sortBy, keyWord, filterTable, filterStatus } = foodOrderHistoryState
  let returnData = {}

  datas.map((order, index) => {
    order.items.map((food, foodIndex) => {
      returnData[order.transactionId + index + foodIndex] = {
        orderId: order.id,
        foodIndex: foodIndex,
        tableName: tableData[order.tableId] ? tableData[order.tableId].name : '',
        tableId: order.tableId,
        time: order.createdAt,
        id: food.id,
        imageUrl: food.imageUrl,
        name: food.name,
        status: food.status,
        quantity: food.quantity,
        price: food.currentPrice,
        totalPrice: food.currentPrice * food.quantity
      }
    })
  })

  let data = []

  if (sortType === 'AtoZ') {
    data = sortObjectsByKeyAtoZ(returnData, sortBy, 0, 999)
  } else {
    data = sortObjectsByKeyZtoA(returnData, sortBy, 0, 999)
  }

  if (keyWord !== '') {
    data = R.filter(item => checkKeyword(keyWord, item))(data)
  }

  if (filterTable !== 'Tất cả' && filterTable !== '') {
    data = R.filter(item => item.tableId === filterTable)(data)
  }

  if (filterStatus !== 'Tất cả' && filterStatus !== '') {
    data = R.filter(item => item.status === filterStatus)(data)
  }

  return data
}
