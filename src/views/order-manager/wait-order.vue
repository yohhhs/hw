<template>
  <div class="wait-order">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="queryArgs.orderNumber" placeholder="单号"/>
      <Input class="query-item" v-model="queryArgs.userName" placeholder="用户名"/>
      <Input class="query-item" v-model="queryArgs.updateColumn" placeholder="更新内容"/>
      <Select  class="query-item" placeholder="更新类型" v-model="queryArgs.updateType" clearable>
        <Option v-for="item in updateType" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="开始时间"
        clearable @on-change="orderStartChange"></DatePicker>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="结束时间"
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
  import {allOrder, getUpdateRecordList} from '@/api/request'

  export default {
    data() {
      return {
        updateType: [
          {
            id: 1,
            name: '更新数据'
          },
          {
            id: 2,
            name: '审核'
          }
        ],
        currentDetail: null,
        lookModal: false,
        selectIds: [],
        queryArgs: {
          orderNumber: '',
          userName: '',
          updateColumn: '',
          startTime: '',
          endTime: '',
          updateType: ''
        },
        tableColumns: [
          {
            title: '订单号',
            key: 'orderNumber'
          },
          {
            title: '用户名',
            key: 'userName'
          },
          {
            title: '更新类型',
            render: (h, params) => {
              return h('div', params.row.updateType === 1 ? '更新数据' : '审核')
            }
          },
          {
            title: '更新内容',
            key: 'updateColumn'
          },
          {
            title: '旧数据',
            key: 'oldData'
          },
          {
            title: '新数据',
            key: 'newData'
          },
          {
            title: '时间',
            key: 'createTime'
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
      this.getUpdateRecordList()
    },
    methods: {
      getUpdateRecordList() {
        this.openTableLoading()
        getUpdateRecordList({
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
        this.getUpdateRecordList()
      },
      changePage(no) {
        this.pageNo = no
        this.getUpdateRecordList()
      },
      orderStartChange(time) {
        this.queryArgs.startTime = time
      },
      orderEndChange(time) {
        this.queryArgs.endTime = time
      }
    }
  }
</script>
<style lang="less">
</style>
