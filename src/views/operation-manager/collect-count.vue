<template>
  <div class="collect-count">
    <div v-show="!lookDetail">
      <Table :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
      <Page style="margin-top: 20px;text-align: center;" :current="pageNo" :total="total" show-elevator
            @on-change='changePage'></Page>
    </div>
    <Modal
      v-model="lookModal"
      width="1000"
      :mask-closable="false"
      title="营业部订购明细">
      <div v-if="lookModal" class="order-info">
        <p class="goods-name">{{saleInfo.goodsName }}</p>
        <p class="goods-info">
          <span style="margin-right: 20px">起订量：{{saleInfo.purchaseMinCount }}</span>
          <span>集采到期时间：{{saleInfo.purchaseEndTime }}</span>
        </p>
      </div>
      <ul v-if="lookModal">
        <li v-for="item in saleList" class="sale-item">
          <p class="sale-title">
            <span class="sale-name">{{item.organizeName + ' ' + item.companyName + ' ' + item.saleDepartmentName }}</span>
            <span class="order-number">当前订购数量：{{item.purchaseOrderCount}}</span>
          </p>
          <Table :columns="saleColumns" :data="item.orderList"></Table>
        </li>
      </ul>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import {table, page} from '@/common/js/mixins'
  import {collectCount} from '@/api/request'

  export default {
    data () {
      return {
        lookModal: false,
        lookDetail: false,
        saleInfo: null,
        saleList: null,
        saleColumns: [
          {
            title: '订单编号',
            key: 'purchaseOrderNumber'
          },
          {
            title: '订单数量',
            key: 'goodsCount'
          },
          {
            title: '下单用户',
            key: 'agentMemberName'
          },
          {
            title: '用户手机号',
            key: 'agentMemberMobile'
          },
          {
            title: '支付方式',
            render: (h, params) => {
              return h('div', params.row.payType === 1 ? '线上' : '线下')
            }
          },
          {
            title: '下单时间',
            key: 'createTimeStr'
          },
          {
            title: '支付时间',
            key: 'payTime'
          },
          {
            title: '订单金额',
            render: (h, params) => {
              return h('div', params.row.goodsCount * params.row.salePrice)
            }
          }
        ],
        tableColumns: [
          {
            title: '集采商品id',
            key: 'purchaseGoodsId'
          },
          {
            title: '基础商品名称',
            key: 'purchaseGoodsId'
          },
          {
            title: '商品售价',
            key: 'salePrice'
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
            title: '起订量',
            key: 'purchaseMinCount'
          },
          {
            title: '关联营业部数量',
            key: 'saleDepartmentCount'
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
                      collectCount.getGoodsCountDetail({
                        purchaseGoodsId: params.row.purchaseGoodsId
                      }).then(data => {
                        if (data !== 'isError') {
                          this.saleInfo = params.row
                          this.saleList = data
                          this.lookModal = true
                        }
                      })
                    }
                  }
                }, '查看订购明细')
              ])
            }
          }
        ]
      }
    },
    mixins: [table, page],
    created () {
      this.getOrderList()
    },
    methods: {
      getOrderList () {
        this.openTableLoading()
        collectCount.getPurchaseGoodsCountList({
          pageNo: this.pageNo,
          pageSize: 10
        }).then(data => {
          this.closeTableLoading()
          if (data !== 'isError') {
            this.tableData = data.list
            this.total = data.total
          }
        }).catch(err => {
          this.closeTableLoading()
        })
      },
      changePage (no) {
        this.pageNo = no
        this.getOrderList()
      }
    }
  }
</script>
<style lang="less" scoped>
  .order-info {
    padding: 0 10px 10px;
    font-size: 14px;
    color: #444;
    border-bottom: 2px solid #ddd;
  }
  .sale-item {
    margin-bottom: 5px;
  }
  .sale-title {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
</style>
