<template>
  <div class="order-count">
    <div class="order-item-header">
      本{{typeName[this.dateType - 1]}}订单统计
      <span style="float: right;color: #f5222d">销售金额：￥{{showData.totalMoney}}</span>
    </div>
    <ul class="order-number-list">
      <li class='number-list-item'>
        <p class="number">{{showData.orderCount1}}</p>
        <p class="order-name">未支付</p>
      </li>
      <li class='number-list-item'>
        <p class="number">{{showData.orderCount2}}</p>
        <p class="order-name">待发货</p>
      </li>
      <li class='number-list-item'>
        <p class="number">{{showData.orderCount5}}</p>
        <p class="order-name">备货中</p>
      </li>
      <li class='number-list-item'>
        <p class="number">{{showData.orderCount3}}</p>
        <p class="order-name">待收货</p>
      </li>
      <li class='number-list-item'>
        <p class="number">{{showData.orderCount4}}</p>
        <p class="order-name">已完成</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import { getOrderCountByDate } from '@/api/request'

  export default {
    name: "order-count",
    props: {
      dateType: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        typeName: ['日', '周', '月', '年'],
        showData: {
          orderCount1: 0,
          orderCount2: 0,
          orderCount3: 0,
          orderCount4: 0,
          orderCount5: 0,
          totalMoney: 0
        }
      }
    },
    created () {
      // this.getData()
    },
    methods: {
      getData () {
        getOrderCountByDate({
          dateType: this.dateType
        }).then(data => {
          if (data !== 'isError') {
            if (data) {
              for (let k in this.showData) {
                this.showData[k] = data[k] ? data[k] : 0
              }
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .order-count {
    width: 24.5%;
    border-radius: 4px;
    background-color: #fff;
  }
  .order-item-header {
    padding: 0 10px;
    line-height: 50px;
    font-size: 16px;
    border-bottom: 1px solid #f1f1f1;
  }
  .order-number-list {
    padding: 20px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    text-align: center;
  }
  .number {
    margin-bottom: 5px;
  }
</style>
