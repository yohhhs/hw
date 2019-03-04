<template>
  <div class="collect-goods">
      <query-wrapper @userQuery="queryList">
        <Input class="query-item" v-model="queryArgs.keyword" placeholder="商品名称/活动名称" />
        <DatePicker
          class="query-item"
          type="datetime" placeholder="添加开始时间"
          clearable @on-change="addStartChange"></DatePicker>
        <DatePicker
          class="query-item"
          type="datetime" placeholder="添加结束时间"
          clearable @on-change="addEndChange"></DatePicker>
        <DatePicker
          class="query-item"
          type="datetime" placeholder="集采开始时间"
          clearable @on-change="purchaseStartChange"></DatePicker>
        <DatePicker
          class="query-item"
          type="datetime" placeholder="集采结束时间"
          clearable @on-change="purchaseEndChange"></DatePicker>
        <Select class="query-item" v-model="queryArgs.goodsState" placeholder="商品状态">
          <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </query-wrapper>
      <btn-wrapper @btnClick="btnClick"></btn-wrapper>
      <Table :columns="tableColumns" :loading="tableLoading" :data="tableData" @on-selection-change="tableSelectChange"></Table>
      <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
      <Modal
        v-model="addModal.isShow"
        :mask-closable="false"
        :width="800"
        title="添加集采商品">
        <collect-edit v-if="addModal.isShow" ref="addEdit" :goodsList="goodsList" :activeList="activeList" :orgList="orgList"></collect-edit>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="addModal.loading"  @click="addConfirm">确定</Button>
        </div>
      </Modal>
      <Modal
        v-model="writeModal.isShow"
        :mask-closable="false"
        :width="800"
        title="修改集采商品">
        <collect-edit v-if="writeModal.isShow" ref="writeEdit" :goodsList="goodsList" :activeList="activeList" :orgList="orgList" :isWrite="true" :detail="detail"></collect-edit>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="writeModal.loading"  @click="writeConfirm">确定</Button>
        </div>
      </Modal>
    <Modal
      v-model="lookModal"
      :mask-closable="false"
      :width="800"
      title="查看集采商品">
      <collect-edit v-if="lookModal" :goodsList="goodsList" :activeList="activeList" :orgList="orgList" :isWrite="true" :detail="detail" :isLook="true"></collect-edit>
      <div slot="footer">
        <!--<Button type="primary" size="large" long :loading="writeModal.loading"  @click="writeConfirm">确定</Button>-->
      </div>
    </Modal>
  </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import btnWrapper from '@/components/btn-wrapper'
  import collectEdit from './components/collect-edit'
  import { message, table, page, writeModal, addModal } from '@/common/js/mixins'
  import { collectGoods } from '@/api/request'
  export default {
    data () {
      return {
        lookModal: false,
        detail: null,
        orgList: [],
        activeList: [],
        goodsList: [],
        selectIds: [],
        statusList: [
          {
            id: 1,
            name: '上架'
          },
          {
            id: 0,
            name: '下架'
          }
        ],
        queryArgs: {
          keyword: '',
          addStartTime: '',
          addEndTime: '',
          purchaseStartTime: '',
          purchaseEndTime: '',
          goodsState: ''
        },
        tableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '集采商品编号',
            key: 'purchaseOrderNumber'
          },
          {
            title: '商品名称',
            key: 'goodsName'
          },
          {
            title: '商品售价',
            key: 'salePrice'
          },
          {
            title: '关联活动',
            key: 'activityName'
          },
          {
            title: '状态',
            render: (h, params) => {
              return h('div', params.row.state == 0 ? '下架' : '上架')
            }
          },
          {
            title: '商品发布时间',
            key: 'createTimeStr'
          },
          {
            title: '集采到期时间',
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
                      this.currentPurchaseGoodsId = params.row.purchaseGoodsId
                      collectGoods.getPurchaseGoodsDetail({
                        purchaseGoodsId: params.row.purchaseGoodsId
                      }).then(data => {
                        if (data !== 'isError') {
                          this.detail = data
                          this.lookModal = true
                        }
                      })
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.currentPurchaseGoodsId = params.row.purchaseGoodsId
                      collectGoods.getPurchaseGoodsDetail({
                        purchaseGoodsId: params.row.purchaseGoodsId
                      }).then(data => {
                        if (data !== 'isError') {
                          this.detail = data
                          this.openWriteModal()
                        }
                      })
                    }
                  }
                }, '编辑')
              ])
            }
          }
        ],
        currentPurchaseGoodsId: ''
      }
    },
    components: {
      queryWrapper,
      btnWrapper,
      collectEdit
    },
    mixins: [message, table, page, writeModal, addModal],
    created () {
      this.getGoodsList()
      this.getActiveList()
      this.getPurchaseGoodsList()
      this.getOrgList()
    },
    methods: {
      getOrgList () {
        collectGoods.getOrganizeUserList({
          pageSize: 1000,
          pageNo: 1
        }).then(data => {
          if (data !== 'isError') {
            this.orgList = data.list
          }
        })
      },
      getActiveList () {
        collectGoods.getActiveList({
          pageNo: 1,
          pageSize: 10000
        }).then(data => {
          if (data !== 'isError') {
            this.activeList = data.list
          }
        })
      },
      getGoodsList () {
        collectGoods.getGoodsList({
          pageSize: 10000,
          pageNo: 1,
          goodsState: 1
        }).then(data => {
          if (data !== 'isError') {
            this.goodsList = data.list
          }
        })
      },
      getPurchaseGoodsList () {
        this.openTableLoading()
        collectGoods.getPurchaseGoodsList({
          pageSize: 10,
          pageNo: this.pageNo,
          ...this.queryArgs
        }).then(data => {
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
            this.closeTableLoading()
          }
        })
      },
      addStartChange (time) {
        this.queryArgs.addStartTime = time
      },
      addEndChange (time) {
        this.queryArgs.addEndTime = time
      },
      purchaseStartChange (time) {
        this.queryArgs.purchaseStartTime = time
      },
      purchaseEndChange (time) {
        this.queryArgs.purchaseEndTime = time
      },
      btnClick (handleName) {
        switch (handleName) {
          case '发布集采商品':
            this.openAddModal()
            break
          case '上架商品':
            this.updateStatus(1)
            break
          case '下架商品':
            this.updateStatus(0)
            break
        }
      },
      queryList () {
        this.pageNo = 1
        this.getPurchaseGoodsList()
      },
      changePage (no) {
        this.pageNo = no
        this.getPurchaseGoodsList()
      },
      updateStatus (state) {
        if (this.selectIds.length === 0) {
          return this.warningInfo('请选择操作对象')
        }
        collectGoods.updatePurchaseGoodsStatus({
          purchaseGoodsId: this.selectIds.toString(),
          state
        }).then(data => {
          if (data !== 'isError') {
            this.successInfo('更新成功')
            this.getPurchaseGoodsList()
            this.selectIds = []
          }
        })
      },
      addConfirm () {
        let returnData = this.$refs.addEdit.returnData()
        if (returnData) {
          this.openAddLoading()
          collectGoods.addPurchaseGoods({
            ...returnData
          }).then(data => {
            this.closeAddLoading()
            if (data !== 'isError') {
              this.successInfo('添加成功')
              this.getPurchaseGoodsList()
              this.closeAddModal()
            }
          })
        }
      },
      writeConfirm () {
        let returnData = this.$refs.writeEdit.returnData()
        if (returnData) {
          this.openWriteLoading()
          collectGoods.updatePurchaseGoods({
            purchaseGoodsId: this.currentPurchaseGoodsId,
            ...returnData
          }).then(data => {
            this.closeWriteLoading()
            if (data !== 'isError') {
              this.successInfo('修改成功')
              this.getPurchaseGoodsList()
              this.closeWriteModal()
            }
          })
        }
      },
      tableSelectChange (selection) {
        let ids = []
        selection.forEach(item => {
          ids.push(item.purchaseGoodsId)
        })
        this.selectIds = ids
      }
    }
  }
</script>
<style lang="less">
</style>
