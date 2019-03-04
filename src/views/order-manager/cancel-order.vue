<template>
  <div class="cancel-order">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="queryArgs.keyword" placeholder="邀请码" clearable/>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="征订开始时间"
        clearable :editable="false" @on-change="orderStartChange"></DatePicker>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="征订结束时间"
        clearable :editable="false" @on-change="orderEndChange"></DatePicker>
      <Select class="query-item" v-model="queryArgs.solicitState" placeholder="请选择状态" clearable>
        <Option v-for="item in orderStatusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </query-wrapper>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData" @on-selection-change="tableSelectChange"></Table>
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
      title="修改邀请码">
      <order-edit ref="writeEdit" v-if="writeModal.isShow" isWrite :detail="currentDetail"></order-edit>
      <div slot="footer" style="text-align: center">
        <Button type="primary" :loading="writeModal.loading" @click="writeConfirm">修改邀请码</Button>
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
  import orderEdit from './components/order-edit'
  import { message, table, page, addModal, writeModal } from '@/common/js/mixins'
  import { allOrder } from '@/api/request'

  export default {
    data () {
      return {
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
          keyword: '',
          startTime: '',
          endTime: '',
          solicitState: ''
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
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center'
          // },
          {
            title: '邀请码',
            key: 'inviteCode',
            width: 90
          },
          {
            title: '产品名称',
            key: 'goodsName'
          },
          {
            title: '供应商',
            key: 'supplier'
          },
          {
            title: '产品单位',
            key: 'standard'
          },
          {
            title: '产品状态',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: params.row.goodsStatus === 0 ? '#ed4014' : '#19be6b'
                }
              }, params.row.goodsStatus === 0 ? '停用' : '启用')
            }
          },
          {
            title: '征订状态',
            render: (h, params) => {
              let status = ''
              switch (params.row.solicitState) {
                case 1:
                  status = '未开始'
                  break
                case 2:
                  status = '进行中'
                  break
                case 3:
                  status = '已完成'
                  break
              }
              return h('div', status)
            }
          },
          {
            title: '开始时间',
            key: 'startTime',
            width: 100
          },
          {
            title: '结束时间',
            key: 'endTime',
            width: 100
          },
          {
            title: '创建时间',
            key: 'createTimeStr',
            width: 100
          },
          {
            title: '更新时间',
            key: 'updateTimeStr',
            width: 100
          },
          {
            title: '操作',
            width: 120,
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between'
                }
              }, [
                h('span', {
                  style: {
                    color: '#2d8cf0',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      if (params.row.solicitState === 1) {
                        return this.warningInfo('征订未开始，无法查看')
                      }
                      this.currentDetail = params.row
                      this.lookModal = true
                      this.getListDetail()
                    }
                  }
                }, '查看'),
                h('span', {
                  style: {
                    color: '#2d8cf0',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      if (params.row.solicitState === 1) {
                        return this.warningInfo('征订未开始，无法导出')
                      }
                      this.currentDetail = params.row
                      window.location.href = `https://www.topasst.com/solicitCms/purchaseOrder/getPurchaseOrderExcelList?solicitGoodsId=${params.row.goodsId}`
                    }
                  }
                }, '导出')
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
    mixins: [message, table, page, addModal, writeModal],
    created () {
      this.getAllOrder()
    },
    methods: {
      getAllOrder () {
        this.openTableLoading()
        allOrder.getSolicitGoodsList({
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
      hasBtn (name) {
        return this.handleList[this.$route.name] && (this.handleList[this.$route.name].indexOf('新建邀请码') > -1)
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
      // btnClick (handleName) {
      //   switch (handleName) {
      //     case '强制关闭':
      //       if (this.selectIds.length === 0) {
      //         return this.warningInfo('请选择操作对象')
      //       }
      //       this.$Modal.confirm({
      //         content: '确定要关闭吗？',
      //         loading: true,
      //         onOk: () => {
      //           allOrder.closeOrder({
      //             purchaseOrderId: this.selectIds.toString()
      //           }).then(data => {
      //             if (data !== 'isError') {
      //               this.successInfo('关闭成功')
      //               this.getAllOrder()
      //             }
      //               this.$Modal.remove()
      //           })
      //         }
      //       })
      //       break
      //     case '导出订单':
      //       window.location.href = 'https://www.topasst.com/cms/purchaseOrder/getPurchaseOrderExcelList?orderState=' + this.queryArgs.orderState
      //       break
      //     case '导入订单':
      //       this.uploadModal = true
      //       break
      //   }
      // },
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
          allOrder.updateSolicitGoods({
            goodsId: this.currentDetail.goodsId,
            ...returnData
          }).then(data => {
            this.closeWriteLoading()
            if (data !== 'isError') {
              this.successInfo('修改邀请码成功')
              this.getAllOrder()
              this.closeWriteModal()
            }
          }).catch(err => {
            this.closeWriteLoading()
          })
        }
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
