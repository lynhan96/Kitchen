import React, {Component} from 'react'
import R from 'ramda'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Navigator from 'lib/Navigator'
import { dispatchLogout } from 'ducks/admin'

class Header extends Component {
  constructor (props) {
    super(props)
    this.search = this.search.bind(this)
  }

  search(event) {
    Navigator.push('search?keyword=' + event.target.value)
  }

  render() {
    const { signedIn, dispatch, notifications } = this.props
    const logout = dispatchLogout(dispatch)
    let notificationData = []

    if (notifications != null) {
      notificationData = R.values(notifications)
    }

    if (signedIn) {
      return (
        <nav className='navbar navbar-transparent navbar-absolute fixed'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle' data-toggle='collapse'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              </button>
            </div>
            <div className='collapse navbar-collapse' style={{ background: 'white' }}>
              <ul className='nav navbar-nav navbar-right'>
                <li className='dropdown'>
                  <a href='#' className='dropdown-toggle' data-toggle='dropdown' aria-expanded="false">
                    <i className='material-icons'>notifications</i>
                    <span className='notification'>{notificationData.length}</span>
                    <p className='hidden-lg hidden-md'>Notifications</p>
                  </a>
                  <ul className='dropdown-menu'>
                    {notificationData.map((value, index) => {
                      return (
                        <li key={index}>
                          <a href='#'>{value.message}</a>
                        </li>
                      )
                    })}
                  </ul>
                </li>
                <li>
                  <Link to='dashboard' onClick={e => { e.preventDefault(); logout() }}>
                    <i className='material-icons'>subdirectory_arrow_right</i>
                    <p className='hidden-lg hidden-md'>Thoát</p>
                  </Link>
                </li>
              </ul>
              <div className="form-group" style={styles.search}>
                <input type="text" className="form-control" placeholder="Tìm kiếm món ăn" onChange={this.search}/>
              </div>
            </div>
          </div>
        </nav>
      )
    } else {
      return (<div/>)
    }
  }
}

const mapStateToProps = (state) => ({
  signedIn: state.admin.signedIn,
  notifications: state.notification.data
})

export default connect(mapStateToProps)(Header)

const styles = {
  search: {
    width: '70%',
    marginTop: '4px'
  }
}
