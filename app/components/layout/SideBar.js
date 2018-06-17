import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Navigator from 'lib/Navigator'
import { fetchFoodCategories } from 'lib/actions/foodCategory'
import { fetchFoods } from 'lib/actions/food'
import { dispatchLogout } from 'ducks/admin'

class SideBar extends Component {
  constructor (props) {
    super(props)
    this.changePage = this.changePage.bind(this)
    this.reloadMenu = this.reloadMenu.bind(this)
  }

  reloadMenu() {
    this.props.dispatch(fetchFoods())
    this.props.dispatch(fetchFoodCategories())
  }

  changePage(index) {
    this.props.dispatch(fetchFoods())
    this.props.dispatch(fetchFoodCategories())
    Navigator.push('foods?index=' + index)
  }

  isActive (value) {
    return 'category ' + (window.location.href.includes('index=' + value) ? 'active' : '')
  }

  render() {
    const { admin, foodCategory } = this.props
    const { activeLink, signedIn } = admin
    const { items } = foodCategory
    const logout = dispatchLogout(this.props.dispatch)

    if (signedIn) {
      return (
        <div className='sidebar slde-bar-bg-image' data-color='purple'>
          <div className='logo'>
            <Link to='dashboard' className='simple-text' style={{ textTransform: 'none', textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
              BK Cookery
            </Link>
          </div>
          <div className='sidebar-wrapper'>
            <ul className='nav'>
              <li className={activeLink === 'map-tables' ? 'active' : ''}>
                <Link to='map-tables'>
                  <i className='material-icons'>map</i>
                  <p>Sơ đồ nhà hàng</p>
                </Link>
              </li>
              <li className={activeLink === 'food-order-history' ? 'active' : ''}>
                <Link to='food-order-history'>
                  <i className='material-icons'>local_dining</i>
                  <p>Quản lí món ăn</p>
                </Link>
              </li>
              <li className={activeLink === 'order-food' ? 'active' : ''}>
                <Link to='#' onClick={e => { e.preventDefault(); this.reloadMenu() }}>
                  <i className="material-icons">list</i>
                  <p>Quản lí thực đơn</p>
                </Link>
                <ul className='sub-menu'>
                  {items.map((item, index) =>
                    <li className={this.isActive(index)} key={index}>
                      <Link to='#' onClick={e => { e.preventDefault(); this.changePage(index) }}>
                      <i className="material-icons">local_dining</i>
                      <span>{item.name}</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
              <li>
                <Link to='#' onClick={e => { e.preventDefault(); logout() }}>
                  <i className='material-icons'>subdirectory_arrow_right</i>
                  <p>Thoát</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )
    } else {
      return (<div/>)
    }
  }
}

const mapStateToProps = (state) => ({
  admin: state.admin,
  foodCategory: state.foodCategory
})

export default connect(mapStateToProps)(SideBar)
