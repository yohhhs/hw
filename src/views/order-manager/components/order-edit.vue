<template>
  <div class="order-edit">
    <div class="modal-input-item">
      <p class="label">品牌</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.brand" placeholder="请输入品牌"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">计划日期</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.planTime" placeholder="请输入计划日期"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">送达省</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.sendProvince" placeholder="请输入送达省"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">送达市</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.sendCity" placeholder="请输入送达市"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">经销商</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.agency" placeholder="请输入经销商"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">客户</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.customer" placeholder="请输入客户"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">收货人</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.receivedMember" placeholder="请输入收货人"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">收货人电话</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.receivedPhone" placeholder="请输入收货人电话"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">指定物流与电话</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.logistics" placeholder="请输入指定物流与电话"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">物流园</p>
      <div style="width: 350px">
        <Input style="width: 100%" v-model="formData.logisticsPark" placeholder="请输入物流园"/>
      </div>
    </div>
  </div>
</template>
<script>
  import { message } from '@/common/js/mixins'

  export default {
    props: {
      detail: {
        type: Object,
        default: () => {}
      },
      isWrite: {
        type: Boolean,
        default: false
      }
    },
    data () {
        return {
          formData: {
            brand: '',
            planTime: '',
            sendProvince: '',
            sendCity: '',
            agency: '',
            customer: '',
            receivedMember: '',
            receivedPhone: '',
            logistics: '',
            logisticsPark: ''
          }
        }
    },
    components: {},
    mixins: [message],
    created () {
      if (this.isWrite) {
        for (let k in this.formData) {
          this.formData[k] = this.detail[k]
        }
      }
    },
    methods: {
      timeChange (time) {
        this.formData.planTime = time
      },
      returnData () {
        return {
          ...this.formData
        }
      }
    }
  }
</script>
<style lang="less" scope>
  .modal-input-item {
    margin-bottom: 15px;
  }
  .order-edit {
    overflow: auto;
  }
</style>
