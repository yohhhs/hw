<template>
  <div class="costs-count">
    <div class="count-money">
      <div class="count-item">
        <p class="count-name">总计交易成本</p>
        <p class="count-price"><span style="font-weight: bold;">{{countPrice}}</span> 元</p>
      </div>
      <div class="count-item">
        <p class="count-name flex-wrapper">
          <Icon style="cursor: pointer" type="arrow-left-b" @click="subtractDate"></Icon>
          {{showDateStr}}
          <Icon style="cursor: pointer" type="arrow-right-b" @click="addDate"></Icon>
        </p>
        <p class="count-price"><span style="font-weight: bold;">{{monthPrice}}</span> 元</p>
      </div>
    </div>
    <query-wrapper @userQuery="queryList">
      <Input class="query-item" v-model="queryArgs.keyword" placeholder="订单id/商品名称"/>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="支付完成开始时间"
        clearable @on-change="orderStartChange"></DatePicker>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="支付完成结束时间"
        clearable @on-change="orderEndChange"></DatePicker>
    </query-wrapper>
    <btn-wrapper @btnClick="btnClick"></btn-wrapper>
    <Table :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
    <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator @on-change='changePage'></Page>
  </div>
</template>
<script>
  import queryWrapper from '@/components/query-wrapper'
  import btnWrapper from '@/components/btn-wrapper'
  import {table, page, countPrice} from '@/common/js/mixins'
  import {getFinanceList, getFinanceCount} from '@/api/request'

  export default {
    data() {
      return {
        queryArgs: {
          keyword: '',
          payStartTime: '',
          payEndTime: ''
        },
        payTypeList: [
          {
            id: 1,
            name: '线上'
          },
          {
            id: 0,
            name: '线下'
          }
        ],
        tableColumns: [
          {
            title: '订单编号',
            key: 'purchaseOrderNumber'
          },
          {
            title: '订单商品',
            key: 'goodsName'
          },
          {
            title: '采购数量',
            key: 'goodsCount'
          },
          {
            title: '订单金额',
            render: (h, params) => {
              return h('div', params.row.salePrice * params.row.goodsCount)
            }
          },
          {
            title: '成本比例',
            render: (h, params) => {
              let bl =  params.row.buyCost/ params.row.salePrice * 100 + ''
              if (bl.indexOf('.') > -1) {
                bl = (bl * 1).toFixed(2)
              }
              return h('div', params.row.buyCost/ params.row.salePrice * 100 + '%')
            }
          },
          {
            title: '交易成本',
            key: 'buyCost'
          },
          {
            title: '支付完成时间',
            key: 'payTimeStr'
          }
        ]
      }
    },
    components: {
      queryWrapper,
      btnWrapper
    },
    mixins: [table, page, countPrice],
    created () {
      this.getReportList()
      this.getCount()
      this.sumDate()
    },
    methods: {
      getReportList () {
        getFinanceList({
          pageNo: this.pageNo,
          pageSize: 10,
          orderState: 4,
          payType: 1,
          ...this.queryArgs
        }).then(data => {
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        })
      },
      getCount () {
        getFinanceCount({
          searchType: 2,
          orderState: 4
        }).then(data => {
          if (data !== 'isError') {
            this.countPrice = data || 0
          }
        })
      },
      getMonthCount () {
        getFinanceCount({
          searchType: 2,
          orderState: 4,
          searchTime: this.requestDateStr
        }).then(data => {
          if (data !== 'isError') {
            this.monthPrice = data || 0
          }
        })
      },
      orderStartChange(time) {
        this.queryArgs.payStartTime = time
      },
      orderEndChange(time) {
        this.queryArgs.payEndTime = time
      },
      btnClick(handleName) {

      },
      queryList () {
        this.pageNo = 1
        this.getReportList()
      },
      changePage(no) {
        this.pageNo = no
        this.getReportList()
      }
    }
  }
</script>
<style lang="less" scoped>
  .count-money {
    display: flex;
    padding: 15px 30px;
    border-bottom: 2px solid #ddd;
    background: #fff;
  }
  .count-item {
    margin-right: 20px;
    width: 200px;
    height: 80px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #ddd;
    color: #444;
    overflow: hidden;
    .count-name {
      margin: 15px 0 5px;
      font-size: 14px;
    }
    .count-price {
      font-size: 16px;
    }
  }
  .flex-wrapper {
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
