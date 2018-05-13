import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { isAdmin } from 'components/wrappers/isAdmin'
import { updateActiveLink } from 'ducks/admin'
import { preapreFoodOrderHistory, updateSortValue, updateKeyWord } from 'lib/actions/foodOrderHistory'
import ReactPaginate from 'react-paginate'
import { priceToString } from 'lib/objects'

class FoodList extends ReactQueryParams {
  constructor (props) {
    super(props)

    this.sortBy = this.sortBy.bind(this)
    this.search = this.search.bind(this)
  }

  sortBy(fieldName, sortType) {
    const { foodOrderHistoryState } = this.props
    if (sortType === 'AtoZ' && fieldName === foodOrderHistoryState.sortBy) {
      this.props.dispatch(updateSortValue(fieldName, 'ZtoA'))
    } else {
      this.props.dispatch(updateSortValue(fieldName, 'AtoZ'))
    }
  }

  search(e) {
    this.props.dispatch(updateKeyWord(e.target.value))
  }

  componentDidMount() {
    this.props.dispatch(updateActiveLink('food-order-history'))
  }

  render() {
    const { orderingState, foodOrderHistoryState } = this.props
    const { sortType, sortBy, keyWord } = foodOrderHistoryState

    let iconName = 'fa fa-arrow-down '

    if (sortType === 'ZtoA') {
      iconName = 'fa fa-arrow-up '
    }

    const datas = preapreFoodOrderHistory(orderingState.items, this.props.dispatch, foodOrderHistoryState)

    const tableHeader = [
      { 'fieldName': 'id', 'viewTitle': 'ID' },
      { 'fieldName': 'imageUrl', 'viewTitle': 'Hình ảnh' },
      { 'fieldName': 'name', 'viewTitle': 'Tên món ăn' },
      { 'fieldName': 'price', 'viewTitle': 'Gía' },
      { 'fieldName': 'sold', 'viewTitle': 'Đã hoàn thành' },
      { 'fieldName': 'pending', 'viewTitle': 'Đang chờ chế biến' },
      { 'fieldName': 'cancel', 'viewTitle': 'Hủy món' },
      { 'fieldName': 'total', 'viewTitle': 'Tổng số lượng' }
    ]

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-header' data-background-color='purple'>
                  <h4 className='title'>Quản lí món ăn</h4>
                </div>
                <div className='card-content table-responsive'>
                  <div>
                    <div className='row'>
                      <div className='form-group col-md-4 col-xs-12' style={{ margin: '0' }}>
                        <input type='text' className='form-control' placeholder='Tìm kiếm' defaultValue={keyWord} onChange={e => this.search(e)}/>
                        <span className='material-input'></span>
                      </div>
                    </div>
                  </div>
                  <table className='table table-hover'>
                    <thead className='text-primary'>
                      <tr>
                        {tableHeader.map((item, index) => {
                          return (
                            <th key={index}>
                              <Link to='#' onClick={e => { e.preventDefault(); this.sortBy(item.fieldName, sortType) }}>
                                { item.viewTitle }
                              </Link>
                              <i className={sortBy === item.fieldName ? iconName + 'sort-icon-active' : iconName} style={style.iconStyle}></i>
                            </th>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {datas.map(function(item, itemIndex) {
                        return (
                          <tr key={itemIndex}>
                            {tableHeader.map(function(headerItem, headerIndex) {
                              if (headerItem.fieldName === 'price') {
                                return <td key={headerIndex}>{priceToString(item[headerItem.fieldName])}</td>
                              }

                              if (headerItem.fieldName === 'imageUrl') {
                                if (item[headerItem.fieldName] !== null) {
                                  const key = Object.keys(item[headerItem.fieldName])

                                  return (
                                    <td key={headerIndex}>
                                      <img src={item[headerItem.fieldName][key[0]]} style={style.imageItem}/>
                                    </td>
                                  )
                                } else {
                                  return <td key={headerIndex}></td>
                                }
                              }

                              return <td key={headerIndex}>{item[headerItem.fieldName]}</td>
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <div style={{ textAlign: 'center' }}>
                    <ReactPaginate
                      previousLabel={'previous'}
                      nextLabel={'next'}
                      onPageChange={this.onChangePagination}
                      breakLabel={<a href=''>...</a>}
                      breakClassName={'break-me'}
                      pageCount={datas.length / 50}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  orderingState: state.ordering,
  foodOrderHistoryState: state.foodOrderHistory,

})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(FoodList)

const style = {
  iconStyle: {
    fontSize: '14px',
    marginLeft: '5px',
    display: 'none'
  },
  imageItem: {
    width: '80px',
    objectFit: 'contain'
  }
}
