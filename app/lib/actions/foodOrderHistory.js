import R from 'ramda'
import { sortObjectsByKeyAtoZ, sortObjectsByKeyZtoA, checkKeyword } from 'lib/objects'

export const FETCH_FOOD_SORT_VALUE = 'FETCH_FOOD_SORT_VALUE'
export const FETCH_FOOD_SEARCH_VALUE = 'FETCH_FOOD_SEARCH_VALUE'
export const FETCH_FOOD_TOTAL_PAGE = 'FETCH_FOOD_TOTAL_PAGE'

export const updateSortValue = (fieldName, sortType) => ({
  type: FETCH_FOOD_SORT_VALUE,
  sortType: sortType,
  sortBy: fieldName
})

export const updateTotalPage = totalPage => ({
  type: FETCH_FOOD_TOTAL_PAGE,
  totalPage: totalPage
})

export const updateKeyWord = keyWord => ({
  type: FETCH_FOOD_SEARCH_VALUE,
  keyWord: keyWord
})

export const preapreFoodOrderHistory = (orderData, dispatch, foodOrderHistoryState) => {
  const datas = R.values(orderData)
  const { sortType, sortBy, keyWord } = foodOrderHistoryState
  let returnData = {}

  datas.map((order, index) => {
    order.items.map((food, _) => {
      if (!returnData[food.id]) {
        returnData[food.id] = {
          id: food.id,
          imageUrl: food.imageUrl,
          name: food.name,
          price: food.currentPrice,
          sold: 0,
          pending: 0,
          cancel: 0,
          total: 0
        }
      }

      if (food.status === 'Chế biến xong') {
        returnData[food.id].sold += food.quantity
      }

      if (food.status === 'Đang chờ chế biến') {
        returnData[food.id].pending += food.quantity
      }

      if (food.status === 'Hết món') {
        returnData[food.id].cancel += food.quantity
      }

      returnData[food.id].total = returnData[food.id].sold + returnData[food.id].pending + returnData[food.id].cancel
    })
  })

  let data = []

  if (sortType === 'AtoZ') {
    data = sortObjectsByKeyAtoZ(returnData, sortBy, 0, 50)
  } else {
    data = sortObjectsByKeyZtoA(returnData, sortBy, 0, 50)
  }

  if (keyWord !== '') {
    data = R.filter(item => checkKeyword(keyWord, item))(data)
  }

  return data
}
