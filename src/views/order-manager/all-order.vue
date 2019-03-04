<template>
  <div class="all-order">
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
      <Upload style="display: inline-block" :action="action" :on-success="fileSuccess">
        <Button style="margin-right: 20px;" type="primary">导入</Button>
      </Upload>
      <Button type="primary" @click="exportExcel">导出</Button>
    </div>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData" border @on-selection-change="tableSelectChange"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
    <Modal
      v-model="addModal.isShow"
      :mask-closable="false"
      title="新建邀请码">
      <order-edit ref="addEdit" v-if="addModal.isShow"></order-edit>
      <div slot="footer" style="text-align: center">
          <Button type="primary" :loading="addModal.loading" @click="addConfirm">新建邀请码</Button>
      </div>
    </Modal>
    <Modal
      v-model="writeModal.isShow"
      :mask-closable="false"
      title="修改数量">
      <order-edit ref="writeEdit" v-if="writeModal.isShow" isWrite :detail="currentDetail"></order-edit>
      <div slot="footer" style="text-align: center">
        <Button type="primary" :loading="writeModal.loading" @click="writeConfirm">修改数量</Button>
      </div>
    </Modal>
    <Modal
      v-model="changeStatusModal.isShow"
      :mask-closable="false"
      title="修改状态">
      <p v-if="changeStatusModal.isShow" style="text-align: center;font-size: 14px;">确认{{currentDetail.goodsStatus === 0 ? '启用' : '停用'}}当前邀请码征订</p>
      <div slot="footer" style="text-align: center">
        <Button type="primary" :loading="changeStatusModal.loading" @click="changeStatusConfirm">确认修改</Button>
      </div>
    </Modal>
    <Modal
      v-model="deleteModal.isShow"
      :mask-closable="false"
      title="关闭邀请码征订">
      <p style="text-align: center;font-size: 14px;">确认关闭当前邀请码征订</p>
      <div slot="footer" style="text-align: center">
        <Button type="error" :loading="deleteModal.loading" @click="deleteConfirm">确认关闭</Button>
      </div>
    </Modal>
    <Modal
      v-model="lookModal"
      :mask-closable="false"
      width="700"
      title="查看订单详情">
        <div v-if="lookModal" style="display:flex;justify-content:space-between;font-size: 14px;margin-bottom: 15px;padding: 0 5px;">
          <span>邀请码：{{currentDetail.inviteCode}}</span>
          <span>规格：{{currentDetail.standard}}</span>
          <span>征订总数：{{listDetail.count}}</span>
        </div>
      <Table :columns="listDetail.col" :loading="listDetail.loading" :data="listDetail.data"></Table>
      <div slot="footer">
        <!--<Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changeDetailPage'></Page>-->
      </div>
    </Modal>
    <Modal
      v-model="uploadModal"
      :mask-closable="false"
      width="300"
      title="导入订单">
      <div style="text-align: center">
        <Upload :on-success="uploadSuccess" :format="['xls']" action="https://www.topasst.com/cms/purchaseOrder/addPurchaseOrder" :on-format-error="formatHandle">
          <Button style="width: 200px" type="primary" ghost icon="ios-cloud-upload-outline">导入订单</Button>
        </Upload>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import btnWrapper from '@/components/btn-wrapper'
  import tableEdit from './components/table-edit'
  import orderEdit from './components/order-edit'
  import { message, table, page, addModal, writeModal } from '@/common/js/mixins'
  import { allOrder } from '@/api/request'
  import { baseUrl } from '@/common/js/config'

  export default {
    data () {
      return {
        action: baseUrl + '/order/in/getOrderInList',
        listDetail: {
          col: [
            {
              title: '姓名',
              key: 'memberName'
            },
            {
              title: '电话',
              key: 'memberMobile'
            },
            {
              title: '数量',
              key: 'goodsCount'
            },
            {
              title: '区部',
              width: 300,
              key: 'addressDetail'
            }
          ],
          data: [],
          loading: false,
          count: 0
        },
        uploadModal: false,
        currentDetail: null,
        lookModal: false,
        selectIds: [],
        changeStatusModal: {
          isShow: false,
          loading: false
        },
        deleteModal: {
          isShow: false,
          loading: false
        },
        queryArgs: {
          orderNumber: '',
          startTime: '',
          endTime: ''
        },
        orderStatusList: [
          {
            id: 1,
            name: '未开始'
          },
          {
            id: 2,
            name: '进行中'
          },
          {
            id: 3,
            name: '已完成'
          }
        ],
        tableColumns: [
          {
            title: '订单号',
            key: 'orderNumber',
            width: 90,
            fixed: 'left'
          },
          {
            title: '品牌',
            width: 200,
            render: (h, params) => {
              return this.tableRender(h, params, 'brand')
            }
          },
          {
            title: '经销商',
            width: 200,
            render: (h, params) => {
              return this.tableRender(h, params, 'agency')
            }
          },
          {
            title: '送达省',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'sendProvince')
            }
          },
          {
            title: '送达市',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'sendCity')
            }
          },
          {
            title: '收货人',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'receivedMember')
            }
          },
          {
            title: '收货人电话',
            width: 180,
            render: (h, params) => {
              return this.tableRender(h, params, 'receivedPhone')
            }
          },
          {
            title: '计划日期',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'planTime')
            }
          },
          {
            title: '指定物流及电话',
            width: 250,
            render: (h, params) => {
              return this.tableRender(h, params, 'logistics')
            }
          },
          {
            title: '物流园',
            width: 200,
            render: (h, params) => {
              return this.tableRender(h, params, 'logisticsPark')
            }
          },
          {
            title: '托盘/件',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'trayCount')
            }
          },
          {
            title: '门/件',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'doorCount')
            }
          },
          {
            title: '轨道/件',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'trackCount')
            }
          },
          {
            title: '补件/件',
            width: 150,
            render: (h, params) => {
              return this.tableRender(h, params, 'supplyCount')
            }
          },
          {
            title: '总件数',
            render: (h, params) => {
              return h('div', params.row.trayCount * 1 + params.row.doorCount * 1 + params.row.trackCount * 1 + params.row.supplyCount * 1)
            },
            width: 100
          },
          {
            title: '客户',
            width: 300,
            render: (h, params) => {
              return this.tableRender(h, params, 'customer')
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
    mixins: [message, table, page, addModal, writeModal],
    created () {
      this.getAllOrder()
    },
    methods: {
      getAllOrder () {
        this.openTableLoading()
        allOrder.getOrderInList({
          pageNo: this.pageNo,
          pageSize: 10,
          ...this.queryArgs
        }).then(data => {
          this.closeTableLoading()
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      tableSelectChange (selection) {
        let ids = []
        selection.forEach(item => {
          ids.push(item.purchaseOrderId)
      })
        this.selectIds = ids
      },
      tableRender (h, params, tableKey) {
        return h(tableEdit, {
          props: {
            tableKey: tableKey,
            orderInId: params.row.orderInId,
            content: params.row[tableKey]
          },
          on: {
            'valueChange': value => {
              params.row[tableKey] = value
            }
          }
        })
      },
      changeDetailPage (page) {
        this.listDetail.page = page
        this.getListDetail()
      },
      getListDetail () {
        this.listDetail.loading = true
        allOrder.getOrderList({
          pageNo: 1,
          pageSize: 100,
          solicitGoodsId: this.currentDetail.goodsId
        }).then(data => {
          this.listDetail.loading = false
          if (data !== 'isError') {
            this.listDetail.data = data.list
            this.listDetail.count = 0
            if (data.list.length > 0) {
              data.list.forEach(item => {
                this.listDetail.count += item.goodsCount
              })
            }
          }
        }).catch(err => {
          this.listDetail.loading = false
        })
      },
      fileSuccess () {
        this.successInfo('上传成功')
        this.getAllOrder()
      },
      queryList () {
        this.pageNo = 1
        this.getAllOrder()
      },
      changePage (no) {
        this.pageNo = no
        this.getAllOrder()
      },
      orderStartChange (time) {
        this.queryArgs.startTime = time
      },
      orderEndChange (time) {
        this.queryArgs.endTime = time
      },
      uploadSuccess (res) {
        if (res.statusCode == 200) {
          this.successInfo('导入成功')
        } else if (res.statusCode == 412) {
          window.location.href = res.data
        }
        this.getAllOrder()
      },
      formatHandle () {
        this.warningInfo('文件格式不正确')
      },
      openChangeStatusModal () {
        this.changeStatusModal.isShow = true
      },
      openDeleteModal () {
        this.deleteModal.isShow = true
      },
      changeStatusConfirm () {
        this.changeStatusModal.loading = true
        allOrder.updateGoodsStatus({
          goodsId: this.currentDetail.goodsId,
          goodsStatus: this.currentDetail.goodsStatus === 1 ? 0 : 1
        }).then(data => {
          this.changeStatusModal.loading = false
          if (data !== 'isError') {
            this.successInfo('修改状态成功')
            this.changeStatusModal.isShow = false
            this.getAllOrder()
          }
        }).catch(err => {
          this.changeStatusModal.loading = false
        })
      },
      deleteConfirm () {
        this.deleteModal.loading = true
        allOrder.deleteSolicitGoods({
          goodsId: this.currentDetail.goodsId
        }).then(data => {
          this.deleteModal.loading = false
          if (data !== 'isError') {
            this.successInfo('关闭成功')
            this.deleteModal.isShow = false
            this.correctPageNo()
            this.getAllOrder()
          }
        }).catch(err => {
          this.deleteModal.loading = false
        })
      },
      addConfirm () {
        let returnData = this.$refs.addEdit.returnData()
        if (returnData) {
          this.openAddLoading()
          allOrder.addSolicitGoods({
            ...returnData
          }).then(data => {
            this.closeAddLoading()
            if (data !== 'isError') {
              this.successInfo('新建邀请码成功')
              this.getAllOrder()
              this.closeAddModal()
            }
          }).catch(err => {
            this.closeAddLoading()
          })
        }
      },
      writeConfirm () {
        let returnData = this.$refs.writeEdit.returnData()
        if (returnData) {
          this.openWriteLoading()
          allOrder.updateOrderInCount({
            orderInId: this.currentDetail.orderInId,
            ...returnData
          }).then(data => {
            this.closeWriteLoading()
            if (data !== 'isError') {
              this.successInfo('修改数量成功')
              this.getAllOrder()
              this.closeWriteModal()
            }
          }).catch(err => {
            this.closeWriteLoading()
          })
        }
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
        window.location.href = baseUrl + '/order/in/getOrderInListExcel?' + params.join('&')
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
