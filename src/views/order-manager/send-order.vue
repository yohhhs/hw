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
      <Select class="query-item" placeholder="审核状态" v-model="queryArgs.orderOutAudit" clearable>
        <Option v-for="item in auditList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </query-wrapper>
    <div class="btn-wrapper" style="padding-top: 15px;">
      <Button style="margin-right: 20px;" type="primary" @click="priview">审核</Button>
      <Button type="primary" @click="exportExcel">导出</Button>
    </div>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData" border
           @on-selection-change="tableSelectChange"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator
          @on-change='changePage'></Page>
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
          orderOutAudit: ''
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
            title: '品牌',
            width: 120,
            key: 'brand',
            fixed: 'left'
          },
          {
            title: '订单号',
            key: 'orderNumber',
            width: 90,
          },
          {
            title: '出库日期',
            width: 200,
            render: (h, params) => {
              return this.tableRender(h, params, 'outTime')
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
            title: '差异说明',
            width: 200,
            render: (h, params) => {
              return this.tableRender(h, params, 'differenceDetail')
            }
          },
          {
            title: '客户',
            key: 'customer',
            width: 200
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
            width: 200
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
          pageSize: 10,
          ...this.queryArgs
        }).then(data => {
          if (data !== 'isError') {
            data.list.forEach(item => {
              if (item.orderOutAudit === 1) {
                item['_disabled'] = true
              }
            })
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
            orderInId: this.selectionList.map(item => {
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
