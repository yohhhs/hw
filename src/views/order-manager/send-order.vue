<template>
  <div class="send-order">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="queryArgs.orderNumber" placeholder="单号" clearable/>
      <Input class="query-item" v-model="queryArgs.brand" placeholder="品牌" clearable/>
      <Input class="query-item" v-model="queryArgs.agency" placeholder="经销商" clearable/>
      <Input class="query-item" v-model="queryArgs.sendProvince" placeholder="送达省" clearable/>
      <Input class="query-item" v-model="queryArgs.sendCity" placeholder="送达市" clearable/>
      <Input class="query-item" v-model="queryArgs.receivedMember" placeholder="收货人" clearable/>
      <Input class="query-item" v-model="queryArgs.receivedPhone" placeholder="收货人电话" clearable/>
      <Input class="query-item" v-model="queryArgs.planTime" placeholder="计划日期" clearable/>
      <Input class="query-item" v-model="queryArgs.logistics" placeholder="指定物流及电话" clearable/>
      <Input class="query-item" v-model="queryArgs.logisticsPark" placeholder="物流园" clearable/>
      <Input class="query-item" v-model="queryArgs.customer" placeholder="客户" clearable/>
      <Select v-model="queryArgs.driverId" class="query-item" placeholder="请选择司机">
        <Option v-for="item in driverList" :value="item.id" :key="item.name">{{ item.name }}</Option>
      </Select>
      <Input class="query-item" v-model="queryArgs.orderInIds" placeholder="订单id" clearable/>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="开始时间"
        clearable :editable="false" @on-change="orderStartChange"></DatePicker>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="结束时间"
        clearable :editable="false" @on-change="orderEndChange"></DatePicker>
      <Select class="query-item" placeholder="审核状态" v-model="queryArgs.orderOutAudit" clearable>
        <Option v-for="item in auditList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </query-wrapper>
    <div class="btn-wrapper" style="padding-top: 15px;">
      <Button v-if="hasBtn('审核')" style="margin-right: 20px;" type="primary" @click="priview">审核</Button>
      <Button v-if="hasBtn('取消审核')" style="margin-right: 20px;" type="primary" @click="rePriview">取消审核</Button>
      <Button v-if="hasBtn('导出')" type="primary" @click="exportExcel">导出</Button>
    </div>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData" :height="300" border
           @on-selection-change="tableSelectChange"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator show-sizer
          @on-change='changePage' @on-page-size-change="changePageSize"></Page>
  </div>
</template>

<script>
  import {message, table, page, addModal, writeModal} from '@/common/js/mixins'
  import btnWrapper from '@/components/btn-wrapper'
  import queryWrapper from '@/components/query-wrapper'
  import outOrderEdit from './components/outOrderEdit'
  import tableEdit from './components/table-edit'
  import {sendOrderPage} from '@/api/request'
  import {baseUrl} from '@/common/js/config'

  export default {
    name: "send-order",
    data() {
      return {
        queryArgs: {
          orderNumber: '',
          startTime: '',
          endTime: '',
          orderOutAudit: '',
          brand: '',
          agency: '',
          sendProvince: '',
          sendCity: '',
          receivedMember: '',
          receivedPhone: '',
          planTime: '',
          logistics: '',
          logisticsPark: '',
          customer: '',
          driverId: '',
          orderInIds: ''
        },
        auditList: [
          {
            id: 0,
            name: '未审核'
          },
          {
            id: 1,
            name: '已审核'
          }
        ],
        saleId: '',
        collectGoodsId: '',
        saleList: [],
        collectGoodsList: [],
        driverList: [],
        selectionList: [],
        tableColumns: [
          {
            type: 'selection',
            width: 50,
            fixed: 'left'
          },
          {
            title: '订单号',
            key: 'orderNumber',
            width: 90,
            fixed: 'left'
          },
          {
            title: '计划日期',
            width: 180,
            render: (h, params) => {
              return this.tableRender(h, params, 'planTime')
            },
            fixed: 'left'
          },
          {
            title: '经销商',
            key: 'agency',
            width: 200
          },
          {
            title: '总件数',
            render: (h, params) => {
              return h('div', params.row.trayCount * 1 + params.row.doorCount * 1 + params.row.trackCount * 1 + params.row.supplyCount * 1)
            },
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
            title: '实际出库数量',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'differenceGoodsCount')
            }
          },
          {
            title: '差异数量',
            width: 120,
            render: (h, params) => {
              return h('div', params.row.differenceGoodsCount - (params.row.trayCount * 1 + params.row.doorCount * 1 + params.row.trackCount * 1 + params.row.supplyCount * 1))
            }
          },
          {
            title: '差异说明',
            width: 200,
            render: (h, params) => {
              return this.tableRender(h, params, 'differenceDetail')
            }
          },
          {
            title: '出库日期',
            width: 200,
            render: (h, params) => {
              return this.tableRender(h, params, 'outTime')
            }
          },
          {
            title: '客户',
            key: 'customer',
            width: 500
          },
          {
            title: '收货人',
            key: 'receivedMember',
            width: 150
          },
          {
            title: '收货人电话',
            key: 'receivedPhone',
            width: 180
          },

          {
            title: '指定物流及电话',
            key: 'logistics',
            width: 400
          },
          {
            title: '物流园',
            key: 'logisticsPark',
            width: 200
          },
          {
            title: '上传物流单',
            width: 200,
            render: (h, params) => {
              return this.tableRender(h, params, 'logisticsImage', 3)
            }
          },
          {
            title: '发货司机',
            width: 200,
            render: (h, params) => {
              return this.tableRender(h, params, 'driverId', 2)
            }
          },
          {
            title: '运费',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'freight')
            }
          },
          {
            title: '单价',
            width: 100,
            render: (h, params) => {
              return h('div', params.row.freight ? params.row.freight / (params.row.trayCount * 1 + params.row.doorCount * 1 + params.row.trackCount * 1 + params.row.supplyCount * 1) : '')
            }
          },
          {
            title: '木材费',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'woodMoney')
            }
          },
          {
            title: '送达省',
            key: 'sendProvince',
            width: 150
          },
          {
            title: '送达市',
            key: 'sendCity',
            width: 150
          },
          {
            title: '审核状态',
            width: 120,
            render: (h, params) => {
              return h('div', params.row.orderOutAudit === 1 ? '已审核' : '未审核')
            }
          },
          {
            title: '品牌',
            width: 120,
            key: 'brand'
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
    created() {
      this.getDriverList()
      this.getOrderList()
    },
    methods: {
      changePageSize(size) {
        this.pageSize = size
        this.pageNo = 1
        this.getOrderList()
      },
      hasBtn (name) {
        return this.handleList[this.$route.name].indexOf(name) !== -1
      },
      getDriverList() {
        sendOrderPage.getDriverList().then(data => {
          if (data !== 'isError') {
            this.driverList = data
          }
        })
      },
      getOrderList() {
        sendOrderPage.getOrderOutList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          ...this.queryArgs
        }).then(data => {
          if (data !== 'isError') {
            // data.list.forEach(item => {
            //   if (item.orderOutAudit === 1) {
            //     item['_disabled'] = true
            //   }
            // })
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      queryList() {
        this.pageNo = 1
        this.getOrderList()
      },
      changePage(no) {
        this.pageNo = no
        this.getOrderList()
      },
      tableRender(h, params, tableKey, type = 1) {
        return h(tableEdit, {
          props: {
            type: type,
            tableKey: tableKey,
            isOrderIn: false,
            orderInId: params.row.orderInId,
            orderOutAudit: params.row.orderOutAudit,
            content: params.row[tableKey],
            driverList: this.driverList
          },
          on: {
            'valueChange': value => {
              params.row[tableKey] = value
            }
          }
        })
      },
      orderStartChange(time) {
        this.queryArgs.startTime = time
      },
      orderEndChange(time) {
        this.queryArgs.endTime = time
      },
      exportExcel() {
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
      priview() {
        if (this.selectionList && this.selectionList.length > 0) {
          sendOrderPage.auditOrderOut({
            orderInIds: this.selectionList.map(item => {
              return item.orderInId
            }).toString()
          }).then(data => {
            if (data !== 'isError') {
              this.successInfo('审核成功')
              this.getOrderList()
              this.selectionList = []
            }
          })
        } else {
          this.warningInfo('请选择记录')
        }
      },
      rePriview() {
        if (this.selectionList && this.selectionList.length > 0) {
          sendOrderPage.reAuditOrderOut({
            orderInIds: this.selectionList.map(item => {
              return item.orderInId
            }).toString()
          }).then(data => {
            if (data !== 'isError') {
              this.successInfo('取消审核成功')
              this.getOrderList()
              this.selectionList = []
            }
          })
        } else {
          this.warningInfo('请选择记录')
        }
      },
      tableSelectChange(selection) {
        this.selectionList = selection
      }
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
