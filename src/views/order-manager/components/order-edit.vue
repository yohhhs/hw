<template>
  <div class="order-edit">
    <div class="modal-input-item">
      <p class="label">托盘数量</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="formData.trayCount" placeholder="请输入托盘数量"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">门数量</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="formData.doorCount" placeholder="请输入门数量"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">轨道数量</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="formData.trackCount" placeholder="请输入轨道数量"/>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">补件数量</p>
      <div style="width: 350px">
        <InputNumber style="width: 100%" :min="0" v-model="formData.supplyCount"  placeholder="请输入补件数量"/>
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
            trayCount: 0,
            doorCount: 0,
            trackCount: 0,
            supplyCount: 0
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
        this.formData.startTime = time[0]
        this.formData.endTime = time[1]
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
