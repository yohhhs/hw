<template>
  <div class="send-order">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="queryArgs.orderNumber" placeholder="单号" clearable/>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="开始时间"
        clearable :editable="false" @on-change="orderStartChange"></DatePicker>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="结束时间"
        clearable :editable="false" @on-change="orderEndChange"></DatePicker>
    </query-wrapper>
    <div class="btn-wrapper" style="padding-top: 15px;">
      <Button style="margin-right: 20px;" type="primary" @click="openAddModal">添加出库记录</Button>
      <Button type="primary" @click="exportExcel">导出</Button>
    </div>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
    <Modal
      v-model="addModal.isShow"
      width="575"
      :mask-closable="false"
      title="添加出库记录">
      <outOrderEdit></outOrderEdit>
      <div slot="footer" style="text-align: center">
        <Button type="primary" :loading="addModal.loading" @click="addConfirm">确认添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { message, table, page, addModal, writeModal } from '@/common/js/mixins'
  import btnWrapper from '@/components/btn-wrapper'
  import queryWrapper from '@/components/query-wrapper'
  import outOrderEdit from './components/outOrderEdit'
  import {sendOrderPage} from '@/api/request'
  import { baseUrl } from '@/common/js/config'

  export default {
    name: "send-order",
    data () {
      return {
        queryArgs: {
          queryArgs: '',
          startTime: '',
          endTime: ''
        },
        saleId: '',
        collectGoodsId: '',
        saleList: [],
        collectGoodsList: [],
        driverList: [],
        tableColumns: [
          {
            title: '订单号',
            key: 'orderNumber',
            width: 90
          },
          {
            title: '经销商',
            key: 'agency',
            width: 90
          },
          {
            title: '送达省',
            key: 'sendProvince'
          },
          {
            title: '送达市',
            key: 'sendCity'
          },
          {
            title: '收货人',
            key: 'receivedMember'
          },
          {
            title: '收货人电话',
            key: 'receivedPhone'
          },
          {
            title: '计划日期',
            key: 'planTime'
          },
          {
            title: '指定物流及电话',
            key: 'logistics',
            width: 100
          },
          {
            title: '物流园',
            key: 'logisticsPark',
            width: 100
          },
          {
            title: '托盘/件',
            key: 'trayCount',
            width: 100
          },
          {
            title: '门/件',
            key: 'doorCount',
            width: 100
          },
          {
            title: '轨道/件',
            key: 'trackCount',
            width: 100
          },
          {
            title: '补件/件',
            key: 'supplyCount',
            width: 100
          },
          {
            title: '总件数',
            render: (h, params) => {
              return h('div', params.row.trayCount + params.row.doorCount + params.row.trackCount + params.row.supplyCount)
            }
          },
          {
            title: '客户',
            key: 'customer',
            width: 100
          },
          {
            title: '操作',
            width: 80,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between'
                }
              }, [
                h('span', {
                  style: {
                    color: '#f90',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '查看详情')
              ])
            }
          }
        ]
      }
    },
    components: {
      btnWrapper,
      queryWrapper,
      outOrderEdit
    },
    mixins: [message, table, page, addModal, writeModal],
    created () {
      this.getSaleList()
      this.getOrderList()
    },
    methods: {
      getSaleList () {
        sendOrderPage.getDriverList().then(data => {
          if (data !== 'isError') {
            this.driverList = data
          }
        })
      },
      getOrderList () {
        sendOrderPage.getOrderOutList({
          pageNo: this.pageNo,
          pageSize: 10,
          ...this.queryArgs
        }).then(data => {
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      queryList () {
        this.pageNo = 1
        this.getOrderList()
      },
      changePage (no) {
        this.pageNo = no
        this.getOrderList()
      },
      orderStartChange (time) {
        this.queryArgs.startTime = time
      },
      orderEndChange (time) {
        this.queryArgs.endTime = time
      },
      exportExcel () {
        let params = []
        for (let k in this.queryArgs) {
          if (this.queryArgs[k] === 0) {
            params.push(k + '=' + this.queryArgs[k])
          } else {
            params.push(k + '=' + (this.queryArgs[k] ? this.queryArgs[k] : ''))
          }
        }
        window.location.href = baseUrl + '/order/out/getOrderOutListExcel?' + params.join('&')
      },
      addConfirm () {}
    }
  }
</script>

<style lang="less" scoped>
  .btn-wrapper {
    margin-bottom: 5px;
    padding: 8px 30px;
    background-color: #fff;
  }
</style>
