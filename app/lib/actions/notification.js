import { database } from 'database/database'
import R from 'ramda'
import { getAdminData } from 'lib/Constant'

export const FETCH_NOTIFICATION_SUCCESS = 'FETCH_NOTIFICATION_SUCCESS'
export const NOTIFICATION_CHANGED = 'NOTIFICATION_CHANGED'

export const fetchNotificationSuccess = data => ({
  type: FETCH_NOTIFICATION_SUCCESS,
  data
})

export const fetchNotifications = () => (dispatch) => {
  const ref = database.ref(getAdminData().vid + '/notifications')
  ref.once('value')
    .then((snapshot) => {
      const notificaitons = snapshot.val()

      dispatch(fetchNotificationSuccess(notificaitons))
    })
    .then(() => {
      ref.on('child_changed', (result) => dispatch({ type: NOTIFICATION_CHANGED, item: R.assoc('id', result.key, result.val()) }))
    })
    .catch((error) => console.log(error))
}
