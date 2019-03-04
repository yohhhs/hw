<template>
    <div class="base-goods">
      <query-wrapper @userQuery="queryClick">
        <Input class="query-item" v-model.trim="queryArgs.keyWord" type="text" placeholder="商品ID/商品名称/供应商名称" clearable/>
        <DatePicker
          class="query-item"
          type="datetime"
          placeholder="开始时间"
          clearable
          @on-change="queryStartTimeChange"></DatePicker>
        <DatePicker
          class="query-item"
          type="datetime" placeholder="结束时间"
          clearable
          @on-change="queryEndTimeChange"></DatePicker>
        <Select  class="query-item" placeholder="商品状态" v-model="queryArgs.goodsStatus" clearable>
          <Option v-for="item in staticData.goodsType" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </query-wrapper>
      <btn-wrapper @btnClick="btnClick"></btn-wrapper>
      <Table :columns="tableColumns" :loading="tableLoading" :data="tableData" @on-selection-change="tableSelectChange"></Table>
      <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
      <Modal
        v-model="addModal.isShow"
        :mask-closable="false"
        :width="800"
        title="添加基础商品">
        <base-goods-edit v-if="addModal.isShow" ref="addEdit" :supplierList="supplierList"></base-goods-edit>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="addModal.loading"  @click="addConfirm">确定</Button>
        </div>
      </Modal>
      <Modal
        v-model="writeModal.isShow"
        :mask-closable="false"
        :width="800"
        title="修改基础商品">
        <base-goods-edit v-if="writeModal.isShow" ref="writeEdit" :isWrite="true" :detail="detail" :supplierList="supplierList"></base-goods-edit>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="writeModal.loading"  @click="writeConfirm">确定</Button>
        </div>
      </Modal>
      <Modal
        v-model="lookModal"
        :mask-closable="false"
        :width="800"
        title="查看基础商品">
        <base-goods-edit v-if="lookModal" :isLook="true" :isWrite="true" :detail="detail" :supplierList="supplierList"></base-goods-edit>
        <div slot="footer">
        </div>
      </Modal>
    </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import btnWrapper from '@/components/btn-wrapper'
  import baseGoodsEdit from './components/base-goods-edit'
  import { table, message, addModal, writeModal, page } from '@/common/js/mixins'
  import { baseGoods } from '@/api/request'

  export default {
    data () {
      return {
        lookModal: false,
        detail: null,
        queryArgs: {
          keyword: '',
          addStartTime: '',
          addEndTime: '',
          goodsStatus: ''
        },
        selectIds: [],
        supplierList: [],
        staticData: {
          goodsType: [
            {
              id: 0,
              name: '下架'
            },
            {
              id: 1,
              name: '上架'
            }
          ]
        },
        tableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '商品ID',
            key: 'goodsId'
          },
          {
            title: '商品名称',
            key: 'goodsName'
          },
          {
            title: '采购成本',
            key: 'buyCost'
          },
          {
            title: '状态',
            render: (h, params) => {
              return h('div', params.row.goodsStatus === 0 ? '下架' : '上架')
            }
          },
          {
            title: '商品添加时间',
            key: 'createTimeStr'
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
                      baseGoods.getGoodsDetail({
                        goodsId: params.row.goodsId
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
                      baseGoods.getGoodsDetail({
                        goodsId: params.row.goodsId
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
        ]
      }
    },
    components: {
      queryWrapper,
      btnWrapper,
      baseGoodsEdit
    },
    mixins: [table, message, addModal, writeModal, page],
    created () {
      this.getGoodsList()
      this.getSupplierList()
    },
    methods: {
      getGoodsList () {
        baseGoods.getGoodsList({
          pageSize: 10,
          pageNo: this.pageNo,
          ...this.queryArgs
        }).then(data => {
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      getSupplierList () {
        baseGoods.getGoodsSpecialList({
          pageSize: 100000,
          pageNo: 1
        }).then(data => {
          if (data !== 'isError') {
            this.supplierList = data.list
          }
        })
      },
      changePage (no) {
        this.pageNo = no
        this.getGoodsList()
      },
      queryClick () {
        this.pageNo = 1
        this.getGoodsList()
      },
      queryStartTimeChange (time) {
        this.queryArgs.addStartTime =time
      },
      queryEndTimeChange (time) {
        this.queryArgs.addEndTime =time
      },
      btnClick (handleName) {
        switch (handleName) {
          case '新增基础商品':
            this.openAddModal()
            break
          case '上架商品':
            this.updateStatus(1)
            break
          case '下架商品':
            this.updateStatus(0)
            break
        }
      } ,
      updateStatus (goodsStatus) {
        if (this.selectIds.length === 0) {
          return this.warningInfo('请选择操作对象')
        }
        baseGoods.updateGoodsStatus({
          goodsId: this.selectIds.toString(),
          goodsStatus
        }).then(data => {
          if (data !== 'isError') {
            this.successInfo('更新成功')
            this.getGoodsList()
          }
        })
      },
      tableSelectChange (selection) {
        let ids = []
        selection.forEach(item => {
          ids.push(item.goodsId)
        })
        this.selectIds = ids
      },
      addConfirm () {
        let returnData = this.$refs.addEdit.returnData()
        if (returnData) {
          this.openAddLoading()
          baseGoods.addGoods({
            ...returnData
          }).then(data => {
            this.closeAddLoading()
            if (data !== 'isError') {
              this.successInfo('添加成功')
              this.getGoodsList()
              this.closeAddModal()
            }
          })
        }
      },
      writeConfirm () {
        let returnData = this.$refs.writeEdit.returnData()
        if (returnData) {
          this.openWriteLoading()
          baseGoods.updateGoods({
            goodsId: this.detail.goodsId,
            ...returnData
          }).then(data => {
            this.closeWriteLoading()
            if (data !== 'isError') {
              this.successInfo('修改成功')
              this.getGoodsList()
              this.closeWriteModal()
            }
          })
        }
      }
    }
  }
</script>
<style lang="less">
</style>
