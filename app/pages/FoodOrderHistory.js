import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'

import { isAdmin } from 'components/wrappers/isAdmin'
import { updateActiveLink } from 'ducks/admin'
import { preapreFoodOrderHistory, updateSortValue, updateKeyWord, updateFilterTable, updateFilterStatus } from 'lib/actions/foodOrderHistory'
import { priceToString } from 'lib/objects'
import { changeOrderFoodStatus } from 'lib/actions/ordering'

class FoodManagement extends ReactQueryParams {
  constructor (props) {
    super(props)

    this.sortBy = this.sortBy.bind(this)
    this.search = this.search.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.filterByTable = this.filterByTable.bind(this)
    this.filterByStatus = this.filterByStatus.bind(this)
  }

  filterByTable(event) {
    this.props.dispatch(updateFilterTable(event.target.value))
  }

  filterByStatus(event) {
    this.props.dispatch(updateFilterStatus(event.target.value))
  }

  changeStatus(orderingID, foodIndex, newStatus) {
    this.props.dispatch(changeOrderFoodStatus(orderingID, foodIndex, newStatus))
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
    const { orderings, foodOrderHistoryState, tables } = this.props
    const { sortType, sortBy, keyWord, filterTable, filterStatus } = foodOrderHistoryState

    let iconName = 'fa fa-arrow-down '

    if (sortType === 'ZtoA') {
      iconName = 'fa fa-arrow-up '
    }

    const action = this

    const datas = preapreFoodOrderHistory(orderings, this.props.dispatch, foodOrderHistoryState)

    const tableHeader = [
      { 'fieldName': 'time', 'viewTitle': 'Thời gian' },
      { 'fieldName': 'tableName', 'viewTitle': 'Bàn ăn' },
      { 'fieldName': 'imageUrl', 'viewTitle': 'Hình ảnh' },
      { 'fieldName': 'name', 'viewTitle': 'Tên món ăn' },
      { 'fieldName': 'status', 'viewTitle': 'Trạng thái' },
      { 'fieldName': 'price', 'viewTitle': 'Gía Tiền' },
      { 'fieldName': 'quantity', 'viewTitle': 'Số lượng' },
      { 'fieldName': 'totalPrice', 'viewTitle': 'Tổng tiền' }
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
                  <div style={{margin: '30px 0'}}>
                    <div className='row'>
                      <div className='form-group col-md-4 col-xs-12' style={{ margin: '0' }}>
                        <input type='text' className='form-control' placeholder='Tìm kiếm' defaultValue={keyWord} onChange={e => this.search(e)}/>
                        <span className='material-input'></span>
                      </div>
                      <div className='form-group col-md-3 col-xs-12' style={{ marginTop: '0' }}>
                        <label style={{width: '30%', textAlign: 'center'}}>Bàn ăn:</label>
                        <select
                          style={{width: '70%', display: 'inline-block'}}
                          className='form-control'
                          onChange={this.filterByTable}
                          value={filterTable}
                        >
                          <option value={'Tất cả'}>Tất cả</option>
                          {R.keys(tables).map((key, index) => {
                            const item = tables[key]
                            return (
                              <option value={key} key={index}>{item.name}</option>
                            )
                          })}
                        </select>
                      </div>
                      <div className='form-group col-md-3 col-xs-12' style={{ marginTop: '0' }}>
                        <label style={{width: '30%', textAlign: 'center'}}>Trạng thái:</label>
                        <select
                          style={{width: '70%', display: 'inline-block'}}
                          className='form-control'
                          onChange={this.filterByStatus}
                          value={filterStatus}
                        >
                          <option value={'Tất cả'}>Tất cả</option>
                          {['Đang chờ chế biến', 'Chế biến xong', 'Hết món'].map((item, index) => {
                            return (
                              <option value={item} key={index}>{item}</option>
                            )
                          })}
                        </select>
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
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datas.map(function(item, itemIndex) {
                        return (
                          <tr key={itemIndex}>
                            {tableHeader.map(function(headerItem, headerIndex) {
                              if (headerItem.fieldName === 'price' || headerItem.fieldName === 'totalPrice') {
                                return <td key={headerIndex}>{priceToString(item[headerItem.fieldName])}</td>
                              }

                              if (headerItem.fieldName === 'imageUrl') {
                                if (item[headerItem.fieldName] !== null && item[headerItem.fieldName]) {
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
                            <td>
                              <Link
                                to= '#'
                                onClick={e => { e.preventDefault(); action.changeStatus(item.orderId, item.foodIndex, 'Đang chờ chế biến') }}
                                rel='tooltip'
                                title='Xác nhận còn món'
                                className='btn btn-primary btn-simple btn-xs'>
                                <i className='material-icons'>cached</i>
                              </Link>
                              <Link
                                onClick={e => { e.preventDefault(); action.changeStatus(item.orderId, item.foodIndex, 'Chế biến xong') }}
                                type='button' rel='tooltip'
                                title='Chế biến xong'
                                className='btn btn-primary btn-simple btn-xs'>
                                <i className='material-icons'>done_all</i>
                              </Link>
                              <Link
                                onClick={e => { e.preventDefault(); action.changeStatus(item.orderId, item.foodIndex, 'Hết món') }}
                                type='button' rel='tooltip'
                                title='Hủy món'
                                className='btn btn-primary btn-simple btn-xs'>
                                <i className='material-icons'>delete</i>
                              </Link>
                            </td>
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
  orderings: state.ordering.items,
  tables: state.table.items,
  foodOrderHistoryState: state.foodOrderHistory
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(FoodManagement)

const style = {
  iconStyle: {
    fontSize: '14px',
    marginLeft: '5px',
    display: 'none'
  },
  imageItem: {
    width: '80px',
    objectFit: 'contain'
  },
  deleteFood: {
    float: 'left',
    textAlign: 'center',
    fontSize: '17px',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    margin: '8px 5px',
    fontWeight: 'bold'
  }
}
