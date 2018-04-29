import { database } from 'database/database'
import R from 'ramda'
import { getAdminData, getOrderingState } from 'lib/Constant'
import * as firebase from 'firebase'

export const FETCH_ORDERING_BEGIN = 'FETCH_ORDERING_BEGIN'
export const FETCH_ORDERING_SUCCESS = 'FETCH_ORDERING_SUCCESS'
export const FETCH_ORDERING_ERROR = 'FETCH_ORDERING_ERROR'

export const fetchOrderingsBegin = () => ({
  type: FETCH_ORDERING_BEGIN
})

export const fetchOrderingsSuccess = items => ({
  type: FETCH_ORDERING_SUCCESS,
  items: items
})

export const fetchOrderingsError = error => ({
  type: FETCH_ORDERING_ERROR,
  error: error
})

export const fetchOrderings = params => {
  return dispatch => {
    dispatch(fetchOrderingsBegin())
    const ref = database.ref(getAdminData().vid + '/orders')
    ref.once('value')
      .then((snapshot) => {
        dispatch(fetchOrderingsSuccess(snapshot.val()))
      })
      .then(() => {
        ref.on('value', (result) => {
          dispatch(fetchOrderingsSuccess(result.val()))
        })
      })
      .catch((error) => console.log(error))
  }
}

export const changeOrderFoodStatus = (orderingId, itemIndex, newStatus) => {
  return dispatch => {
    const employeeData = getAdminData()
    const orderingData = getOrderingState().items
    let currentOrder = orderingData[orderingId]

    currentOrder.items[itemIndex].status = newStatus

    const totalPrice = R.pipe(
      R.values,
      R.map(item => {
        if (item.status === 'Hết món') {
          return 0
        } else {
          return item.currentPrice * item.quantity
        }
      }),
      R.sum
    )(currentOrder.items)

    currentOrder.totalPrice = totalPrice

    firebase.database().ref(employeeData.vid + '/orders/').child(orderingId).set(currentOrder)

    dispatch(fetchOrderings())
  }
}
