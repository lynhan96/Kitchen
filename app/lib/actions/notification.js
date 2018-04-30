import { database } from 'database/database'
import R from 'ramda'
import { getAdminData } from 'lib/Constant'
import * as firebase from 'firebase'

export const FETCH_NOTIFICATION_SUCCESS = 'FETCH_NOTIFICATION_SUCCESS'
export const NOTIFICATION_CHANGED = 'NOTIFICATION_CHANGED'

export const fetchNotificationSuccess = data => ({
  type: FETCH_NOTIFICATION_SUCCESS,
  data
})

export const fetchNotifications = () => (dispatch) => {
  const ref = firebase.database().ref(getAdminData().vid + '/notifications/')

  ref.orderByChild('type').equalTo('kitchen').on('value', (result) => {
    dispatch(fetchNotificationSuccess(result.val()))
  })
}
