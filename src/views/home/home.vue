<template>
  <div class="home">
    <!--<ul class="card-list">-->
      <!--<li class="list-item">-->
        <!--<div class="card-wrapper">-->
          <!--<div class="icon-wrapper" style="background-color: #2b85e4">-->
            <!--<Icon size="36" color="#fff" type="ios-add-circle"/>-->
          <!--</div>-->
          <!--<div class="content-wrapper">-->
            <!--<p class="content-number">{{topData.todayNewMemberCount}}</p>-->
            <!--<p class="content-name">新增用户</p>-->
          <!--</div>-->
        <!--</div>-->
      <!--</li>-->
      <!--<li class="list-item">-->
        <!--<div class="card-wrapper">-->
          <!--<div class="icon-wrapper" style="background-color: rgb(25, 190, 107)">-->
            <!--<Icon size="36" color="#fff" type="md-people"/>-->
          <!--</div>-->
          <!--<div class="content-wrapper">-->
            <!--<p class="content-number">{{topData.totalMemberCount}}</p>-->
            <!--<p class="content-name">总用户量</p>-->
          <!--</div>-->
        <!--</div>-->
      <!--</li>-->
      <!--<li class="list-item">-->
        <!--<div class="card-wrapper">-->
          <!--<div class="icon-wrapper" style="background-color: rgb(255, 153, 0)">-->
            <!--<Icon size="36" color="#fff" type="ios-alert"/>-->
          <!--</div>-->
          <!--<div class="content-wrapper">-->
            <!--<p class="content-number">{{topData.noOrderMemberCount}}</p>-->
            <!--<p class="content-name">未下单</p>-->
          <!--</div>-->
        <!--</div>-->
      <!--</li>-->
      <!--<li class="list-item">-->
        <!--<div class="card-wrapper">-->
          <!--<div class="icon-wrapper" style="background-color: rgb(237, 63, 20)">-->
            <!--<Icon size="36" color="#fff" type="md-checkmark-circle"/>-->
          <!--</div>-->
          <!--<div class="content-wrapper">-->
            <!--<p class="content-number">{{topData.oneOrderMemberCount}}</p>-->
            <!--<p class="content-name">一次下单</p>-->
          <!--</div>-->
        <!--</div>-->
      <!--</li>-->
      <!--<li class="list-item">-->
        <!--<div class="card-wrapper">-->
          <!--<div class="icon-wrapper" style="background-color: rgb(228, 108, 187)">-->
            <!--<Icon size="36" color="#fff" type="md-done-all"/>-->
          <!--</div>-->
          <!--<div class="content-wrapper">-->
            <!--<p class="content-number">{{topData.passTwoOrderMemberCount}}</p>-->
            <!--<p class="content-name">两次及以上</p>-->
          <!--</div>-->
        <!--</div>-->
      <!--</li>-->
    <!--</ul>-->
    <!--<div class="order-count-wrapper">-->
      <!--<order-count></order-count>-->
      <!--<order-count :dateType="2"></order-count>-->
      <!--<order-count :dateType="3"></order-count>-->
      <!--<order-count :dateType="4"></order-count>-->
    <!--</div>-->
    <!--<Table :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>-->
  </div>
</template>
<script>
  import orderCount from './components/order-count'
  import {home} from '@/api/request'
  import Big from 'big.js'
  import { table } from '@/common/js/mixins'

  export default {
    data() {
      return {
        topData: {
          todayNewMemberCount: 0,
          totalMemberCount: 0,
          noOrderMemberCount: 0,
          oneOrderMemberCount: 0,
          passTwoOrderMemberCount: 0
        },
        tableColumns: [
          {
            title: '商品名称',
            key: 'goodsName'
          },
          {
            title: '累计订单量',
            key: 'totalOrderCount'
          },
          {
            title: '累计销售额',
            key: 'totalMoney'
          },
          {
            title: '购物车收藏量',
            key: 'shoppingCartCount'
          },
          {
            title: '未支付',
            key: 'orderCount1'
          },
          {
            title: '待发货',
            key: 'orderCount2'
          },
          {
            title: '备货中',
            key: 'orderCount5'
          },
          {
            title: '待收货',
            key: 'orderCount3'
          },
          {
            title: '已完成',
            key: 'orderCount4'
          }
        ]
      }
    },
    components: {
      orderCount
    },
    mixins: [table],
    created() {
      // this.getMallCount()
      // this.getGoodsList()
    },
    methods: {
      getMallCount () {
        home.getMemberAndOrderCount().then(data => {
          if (data !== 'isError') {
            for (let k in this.topData) {
              this.topData[k] = data[k]
            }
          }
        })
      },
      getGoodsList () {
        this.openTableLoading()
        home.getGoodsAndOrderCount().then(data => {
          this.closeTableLoading()
          if (data !== 'isError') {
            let footerData = {
              goodsName: '合计',
              totalOrderCount: 0,
              totalMoney: new Big(0),
              shoppingCartCount: 0,
              orderCount1: 0,
              orderCount2: 0,
              orderCount5: 0,
              orderCount3: 0,
              orderCount4: 0
            }
            data.forEach(item => {
              for (let k in item) {
                item[k] = item[k] ? item[k] : 0
                if (k === 'totalMoney') {
                  footerData[k] = footerData[k].plus(item[k])
                } else if (k !== 'goodsName') {
                  footerData[k] += item[k]
                }
              }
            })
            footerData.totalMoney *= 1
            data.push(footerData)
            this.tableData = data
          }
        }).catch(err => {
          this.closeTableLoading()
        })
      }
    }
  }
</script>
<style lang="less">
  .card-list {
    display: flex;
    justify-content: space-between;
    list-style: none;
    .list-item {
      width: 18.5%;
      height: 110px;
      border-radius: 4px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .1);
      background-color: #fff;
      overflow: hidden;
    }
  }

  .card-wrapper {
    display: flex;
    align-content: stretch;
    height: 100%;
    .icon-wrapper {
      flex-basis: 64px;
      flex-shrink: 0;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 100%;
    }
    .content-wrapper {
      padding: 10px 0;
      flex: 1;
      display: inline-flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: center;
      color: #515a6e;
      .content-number {
        font-size: 40px;
      }
      .content-name {
        font-size: 14px;
      }
    }
  }
  .order-count-wrapper {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
</style>
