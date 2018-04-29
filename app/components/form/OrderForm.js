import React, {Component} from 'react'
import { Field, change } from 'redux-form'
import { connect } from 'react-redux'
import R from 'ramda'
import {Tabs, Tab} from 'material-ui/Tabs'

import InputText from 'components/form/element/InputText'
import SubmitButton from 'components/form/element/SubmitButton'

class OrderForm extends Component {
  constructor(props, context) {
    super(props, context)

    this.selectTable = this.selectTable.bind(this)
    this.selectType = this.selectType.bind(this)
  }

  selectTable(tableId) {
    const { orderForm, dispatch } = this.props
    if (orderForm) {
      dispatch(change('order', 'tableId', tableId))
    }
  }

  selectType(type) {
    const { orderForm, dispatch } = this.props
    if (orderForm) {
      dispatch(change('order', 'type', type))
      dispatch(change('order', 'tableId', ''))
    }
  }

  render() {
    const { orderForm, submitting, handleSubmit, tables, zones } = this.props
    const tableIds = R.keys(tables)
    let tableIdDefault = ''

    return (
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <Tabs onChange={this.selectType}>
          <Tab label='Tạo mới order' value='newOrder' style={styles.tabHeader}>
            <div style={styles.wrapper}>
              {tableIds.map((key, index) => {
                const item = tables[key]

                if (item.status === 'Còn trống') {
                  tableIdDefault = key

                  return (
                    <div
                      className={orderForm && orderForm.values && orderForm.values.tableId === key ? 'table-selected' : ''}
                      style={styles.tableWrapper}
                      key={index}
                      onClick={e => { e.preventDefault(); this.selectTable(key) }}
                    >
                      <div style={styles.tableName}>{item.name}</div>
                      <div>{'(' + zones[item.zoneId].name + ')'}</div>
                    </div>
                  )
                }
              })}
            </div>
          </Tab>
          <Tab label='Thêm món ăn cho bàn đã order' value='addOrder' style={styles.tabHeader}>
            <div style={styles.wrapper}>
              {tableIds.map((key, index) => {
                const item = tables[key]
                if (item.status === 'Đã có khách' || item.status === 'Đã đặt bàn') {
                  return (
                    <div
                      className={orderForm && orderForm.values && orderForm.values.tableId === key ? 'table-selected' : ''}
                      style={styles.tableWrapper}
                      key={index}
                      onClick={e => { e.preventDefault(); this.selectTable(key) }}
                    >
                      <div style={styles.tableName}>{item.name}</div>
                      <div>{'(' + zones[item.zoneId].name + ')'}</div>
                    </div>
                  )
                }
              })}
            </div>
          </Tab>
        </Tabs>
        <Field
          name='type'
          component={InputText}
          type='hidden'
          defaultValue='newOrder'
        />
        <Field
          name='tableId'
          component={InputText}
          type='hidden'
          defaultValue={tableIdDefault}
        />
        <div className='col-md-12' style={{ textAlign: 'center' }}>
          <SubmitButton
            text='Xác nhận'
            submitting={submitting}
            className='btn btn-primary'
          />
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
  tables: state.table.items,
  zones: state.zone.items,
  orderForm: state.form.order
})

export default connect(mapStateToProps)(OrderForm)

const styles = {
  tabHeader: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: '17px'
  },
  wrapper: {
    marginTop: '20px'
  },
  tableWrapper: {
    padding: '20px',
    width: '20%',
    border: '2px dashed #ffd984',
    display: 'inline-block',
    textAlign: 'center',
    cursor: 'pointer'
  },
  tableName: {
    fontSize: '17px',
    fontWeight: 'bold'
  }
}
