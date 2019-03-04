<template>
  <div class="already-paid-report">
    <div class="count-money">
      <div class="count-item">
        <p class="count-name">总计取消订单金额</p>
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
      <Select  class="query-item" placeholder="支付方式" v-model="queryArgs.payType" clearable>
        <Option v-for="item in payTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="取消时间"
        clearable @on-change="orderStartChange"></DatePicker>
      <DatePicker
        class="query-item"
        type="datetime" placeholder="取消时间"
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
          cancelStartTime: '',
          cancelEndTime: '',
          payType: ''
        },
        payTypeList: [
          {
            id: 1,
            name: '线上'
          },
          {
            id: 2,
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
            key: 'goodsName '
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
            title: '下单时间',
            key: 'createTimeStr'
          },
          {
            title: '取消时间',
            key: 'cancelTimeStr'
          },
          {
            title: '支付方式',
            render: (h, params) => {
              return h('div', params.row.payType === 1 ? '线上' : '线下')
            }
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
          orderState: 9,
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
          searchType: 1,
          orderState: 9
        }).then(data => {
          if (data !== 'isError') {
            this.countPrice = data || 0
          }
        })
      },
      getMonthCount () {
        getFinanceCount({
          searchType: 1,
          orderState: 9,
          searchTime: this.requestDateStr
        }).then(data => {
          if (data !== 'isError') {
            this.monthPrice = data || 0
          }
        })
      },
      orderStartChange(time) {
        this.queryArgs.cancelStartTime = time
      },
      orderEndChange(time) {
        this.queryArgs.cancelEndTime = time
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
    .flex-wrapper {
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .count-price {
      font-size: 16px;
    }
  }
</style>
