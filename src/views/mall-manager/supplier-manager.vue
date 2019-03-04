<template>
  <div class="supplier-manager">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="queryArgs.keyword" placeholder="关键字" />
      <Select  class="query-item" placeholder="专区状态" v-model="queryArgs.goodsStatus" clearable>
        <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </query-wrapper>
    <btn-wrapper @btnClick="btnClick"></btn-wrapper>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData" @on-selection-change="tableSelectChange"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
    <Modal
      v-model="addModal.isShow"
      :mask-closable="false"
      title="添加供应商">
      <supplier-edit v-if="addModal.isShow" ref="addEdit"></supplier-edit>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addModal.loading"  @click="addConfirm">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="writeModal.isShow"
      :mask-closable="false"
      title="修改供应商">
      <supplier-edit v-if="writeModal.isShow" ref="writeEdit" :detail="supplierDetail" :isWrite="true"></supplier-edit>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeModal.loading"  @click="writeConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import btnWrapper from '@/components/btn-wrapper'
  import supplierEdit from './components/supplier-edit'
  import { message, table, page, writeModal, addModal } from '@/common/js/mixins'
  import { supplierManager } from '@/api/request'

  export default {
    data () {
      return {
        statusList: [
          {
            id: 0,
            name: '停用'
          },
          {
            id: 1,
            name: '启用'
          }
        ],
        supplierDetail: null,
        currentId: '',
        selectIds: [],
        queryArgs: {
          name: ''
        },
        tableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '专区名称',
            key: 'goodsSpecialName'
          },
          {
            title: '专区权重',
            key: 'sort'
          },
          {
            title: '状态',
            render: (h, params) => {
              return h('div', params.row.status === 0 ? '停用' : '启用')
            }
          },
          {
            title: '创建时间',
            key: 'createTimeStr'
          },
          {
            title: '创建人',
            key: 'createName'
          },
          {
            title: '更新时间',
            key: 'updateTimeStr'
          },
          {
            title: '更新人',
            key: 'updateName'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
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
                      this.currentId = params.row.goodsSpecialId
                      this.supplierDetail = params.row
                      this.openWriteModal()
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
      supplierEdit
    },
    mixins: [message, table, page, writeModal, addModal],
    created () {
      this.getSupplierList()
    },
    methods: {
      getSupplierList () {
        this.openTableLoading()
        supplierManager.getGoodsSpecialList({
          pageSize: 10,
          pageNo: this.pageNo,
          ...this.queryArgs
        }).then(data => {
          this.closeTableLoading()
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      queryList () {
        this.pageNo = 1
        this.getSupplierList()
      },
      btnClick (handleName) {
        switch (handleName) {
          case '添加专区':
            this.openAddModal()
            break
          case '启用':
            this.updateStatus(1)
            break
          case '停用':
            this.updateStatus(0)
            break
        }
      },
      updateStatus (goodsSpecialStatus) {
        if (this.selectIds.length === 0) {
          return this.warningInfo('请选择操作对象')
        }
        supplierManager.updateStatus({
          goodsSpecialId: this.selectIds.toString(),
          goodsSpecialStatus
        }).then(data => {
          if (data !== 'isError') {
            this.successInfo('更新成功')
            this.getSupplierList()
          }
        })
      },
      tableSelectChange (selection) {
        let ids = []
        selection.forEach(item => {
          ids.push(item.goodsSpecialId)
        })
        this.selectIds = ids
      },
      queryList () {
        this.pageNo = 1
        this.getSupplierList()
      },
      changePage (no) {
        this.pageNo = no
        this.getSupplierList()
      },
      addConfirm () {
        let returnData = this.$refs.addEdit.returnData()
        if (returnData) {
          this.openAddLoading()
          supplierManager.addGoodsSpecial({
            ...returnData
          }).then(data => {
            this.closeAddLoading()
            if (data !== 'isError') {
              this.successInfo('添加成功')
              this.getSupplierList()
              this.closeAddModal()
            }
          })
        }
      },
      writeConfirm () {
        let returnData = this.$refs.writeEdit.returnData()
        if (returnData) {
          this.openWriteLoading()
          supplierManager.updateGoodsSpecial({
            goodsSpecialId: this.currentId,
            ...returnData
        }).then(data => {
            this.closeWriteLoading()
          if (data !== 'isError') {
            this.successInfo('修改成功')
            this.getSupplierList()
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
