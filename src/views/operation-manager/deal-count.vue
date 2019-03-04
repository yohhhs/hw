<template>
  <div class="deal-count">
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="keyword" placeholder="营业部名称" />
    </query-wrapper>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
    <Modal
      v-model="countModal"
      width="800"
      :mask-closable="false"
      title="交易数据统计">
      <query-wrapper @userQuery="modalQueryList">
        <DatePicker
          class="query-item"
          type="date" placeholder="开始时间"
          clearable @on-change="startChange"></DatePicker>
        <DatePicker
          class="query-item"
          type="date" placeholder="结束时间"
          clearable @on-change="endChange"></DatePicker>
      </query-wrapper>
      <schart class="wrapper" :canvasId="canvasId" :type="type" :data="data" :options="options"></schart>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import Schart from 'vue-schart';
  import {table, page} from '@/common/js/mixins'
  import {dealCount} from '@/api/request'

  export default {
    data () {
      return {
        canvasId: 'myCanvas',
        type: 'bar',
        data: [],
        options: {
          title: '数据统计'
        },
        currentSaleId: '',
        startTime: '',
        endTime: '',
        countModal: false,
        keyword: '',
        tableColumns: [
          {
            title: '营业部名称',
            key: 'saleDepartmentName'
          },
          {
            title: '所属机构',
            key: 'organizeName'
          },
          {
            title: '所属分公司',
            key: 'companyName'
          },
          {
            title: '总交易金额',
            key: 'totalMoney'
          },
          {
            title: '当月交易金额',
            key: 'currentMonthMoney'
          },
          {
            title: '总订单数',
            key: 'purchaseOrderCount'
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
                      this.currentSaleId = params.row.saleDepartmentId
                      this.startTime = ''
                      this.endTime = ''
                      this.countModal = true
                    }
                  }
                }, '查看月度交易金额')
              ])
            }
          }
        ]
      }
    },
    components: {
      queryWrapper,
      Schart
    },
    mixins: [table, page],
    created () {
      this.getDealList()
    },
    methods: {
      getDealList () {
        dealCount.getDataCount({
          pageNo: this.pageNo,
          pageSize: 10,
          keyword: this.keyword
        }).then(data => {
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      getCount () {
        dealCount.getMonthDataCount({
          saleDepartmentId: this.currentSaleId,
          startTime: this.startTime,
          endTime: this.endTime
        }).then(data => {
          if (data !== 'isError') {
            let list = []
            data.forEach(item => {
              list.push({
                name: item.infoId,
                value: item.infoValue
              })
            })
            this.data = list
          }
        })
      },
      changePage (no) {
        this.pageNo = no
        this.getDealList()
      },
      queryList () {
        this.pageNo = 1
        this.getDealList()
      },
      modalQueryList () {
        this.getCount()
      },
      startChange (time) {
        this.startTime = time
      },
      endChange (time) {
        this.endTime = time
      }
    }
  }
</script>
<style lang="less">
  .wrapper {
    width: 100%;
    height: 400px;
  }
</style>
