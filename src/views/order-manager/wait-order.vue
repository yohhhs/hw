<template>
  <div class="wait-order">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="queryArgs.keyword" placeholder="用户姓名/商品名称"/>
      <Input class="query-item" v-model="queryArgs.keyword" placeholder="营业部"/>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="下单开始时间"
        clearable @on-change="orderStartChange"></DatePicker>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="下单结束时间"
        clearable @on-change="orderEndChange"></DatePicker>
    </query-wrapper>
    <btn-wrapper @btnClick="btnClick"></btn-wrapper>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData"
           @on-selection-change="tableSelectChange"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator
          @on-change='changePage'></Page>
    <Modal
      v-model="lookModal"
      :mask-closable="false"
      title="查看订单详情">
      <order-edit v-if="lookModal" :detail="currentDetail"></order-edit>
      <div slot="footer">
      </div>
    </Modal>

  </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import btnWrapper from '@/components/btn-wrapper'
  import orderEdit from './components/order-edit'
  import {message, table, page} from '@/common/js/mixins'
  import {allOrder} from '@/api/request'

  export default {
    data() {
      return {
        currentDetail: null,
        lookModal: false,
        selectIds: [],
        queryArgs: {
          keyword: '',
          addStartTime: '',
          addEndTime: '',
          saleDepartmentId: ''
        },
        tableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '订单编号',
            key: 'purchaseOrderNumber'
          },
          {
            title: '集采商品编号',
            key: 'purchaseGoodsNumber'
          },
          {
            title: '用户',
            key: 'agentMemberName'
          },
          {
            title: '营业部',
            key: 'saleDepartmentName'
          },
          {
            title: '订单金额',
            render: (h, params) => {
              return h('div', params.row.goodsCount * params.row.salePrice)
            }
          },
          {
            title: '商品名称',
            key: 'goodsName'
          },
          {
            title: '数量',
            key: 'goodsCount'
          },
          {
            title: '支付方式',
            render: (h, params) => {
              return h('div', params.row.payType === 1 ? '线上' : '线下')
            }
          },
          {
            title: '起订量',
            render: (h, params) => {
              return h('div', params.row.haveMinCount === 1 ? '达标' : '未达标')
            }
          },
          {
            title: '下单时间',
            key: 'createTimeStr'
          },
          {
            title: '集采结束时间',
            key: 'purchaseEndTime'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      allOrder.orderDetail({
                        purchaseOrderId: params.row.purchaseOrderId
                      }).then(data => {
                        if (data !== 'isError') {
                          this.currentDetail = data
                          this.lookModal = true
                        }
                      })
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      if (params.row.haveMinCount === 0) {
                        return this.warningInfo(`起订量未达标，还需购买${params.row.notHaveCount}个`)
                      }
                      if (params.row.canSend === 0 ) {
                        return this.warningInfo('集采时间未结束')
                      }
                      this.$Modal.confirm({
                        content: '确定要发货吗？',
                        loading: true,
                        onOk: () => {
                          allOrder.sendOrder({
                            purchaseOrderIds: params.row.purchaseOrderId
                          }).then(data => {
                            this.$Modal.remove()
                            if (data !== 'isError') {
                              this.successInfo('发货成功')
                              this.getAllOrder()
                            }
                          })
                        }
                      })
                    }
                  }
                }, '确认发货'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        content: '确定要退款吗？',
                        loading: true,
                        onOk: () => {
                          allOrder.returnPay({
                            purchaseOrderId: params.row.purchaseOrderId
                          }).then(data => {
                            this.$Modal.remove()
                            if (data !== 'isError') {
                              this.successInfo('退款成功')
                              this.getAllOrder()
                            }
                          })
                        }
                      })
                    }
                  }
                }, '退款')
              ])
            }
          }
        ]
      }
    },
    components: {
      btnWrapper,
      queryWrapper,
      orderEdit
    },
    mixins: [message, table, page],
    created() {
      this.getAllOrder()
    },
    methods: {
      getAllOrder() {
        this.openTableLoading()
        allOrder.getOrderList({
          pageNo: this.pageNo,
          pageSize: 10,
          orderState: 2,
          ...this.queryArgs
        }).then(data => {
          this.closeTableLoading()
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      tableSelectChange(selection) {
        let ids = []
        selection.forEach(item => {
          ids.push(item.purchaseOrderId)
        })
        this.selectIds = ids
      },
      btnClick(handleName) {
        switch (handleName) {
          case '批量发货':
            if (this.selectIds.length === 0) {
              return this.warningInfo('请选择操作对象')
            }
            let canSend = true
            this.selectIds.forEach(item => {
              let order = this.tableData.find(data => {
                return data.purchaseOrderId = item
              })
              if (order.haveMinCount === 0 || order.canSend === 0) {
                canSend = false
              }
            })
            if (!canSend) {
              return this.warningInfo('存在不能发货订单')
            }
            this.$Modal.confirm({
              content: '确定要发货吗？',
              loading: true,
              onOk: () => {
                allOrder.sendOrder({
                  purchaseOrderIds: this.selectIds.toString()
                }).then(data => {
                  if (data !== 'isError') {
                    this.successInfo('发货成功')
                    this.getAllOrder()
                    this.selectIds = []
                  }
                  this.$Modal.remove()
                })
              }
            })
            break
          case '下载订单模板':
            break
        }
      },
      queryList() {
        this.pageNo = 1
        this.getAllOrder()
      },
      changePage(no) {
        this.pageNo = no
        this.getAllOrder()
      },
      orderStartChange(time) {
        this.addStartTime = time
      },
      orderEndChange(time) {
        this.addEndTime = time
      }
    }
  }
</script>
<style lang="less">
</style>
