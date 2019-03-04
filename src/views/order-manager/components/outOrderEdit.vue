<template>
  <div class="outOrderEdit">
    <div class="modal-input-item">
      <p class="label">订单id</p>
      <div style="width: 350px">
        <Input style="width: 200px" :min="0" v-model="formData.orderInId" placeholder="请输入订单id"/>
        <Button type="primary">确定</Button>
      </div>
    </div>
  </div>
</template>

<script>
  import {message} from '@/common/js/mixins'
  import { getOrderInDetail } from '@/api/request'

  export default {
    name: "outOrderEdit",
    data() {
      return {
        formData: {
          orderInId: ''
        }
      }
    },
    components: {},
    mixins: [message],
    created() {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>

</style>
