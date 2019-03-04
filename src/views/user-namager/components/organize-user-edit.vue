<template>
  <div class="organize-user-edit">
    <div class="modal-input-item">
      <p class="label">机构名称</p>
      <div style="width: 350px">
        <Input type="text" long v-model="organizeName" placeholder="请输入机构名称" />
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">机构简介</p>
      <div style="width: 350px">
        <Input type="textarea" long :rows="7" v-model="organizeProfile" placeholder="请输入机构简介" />
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
        organizeName: '',
        organizeProfile: ''
      }
    },
    mixins: [message],
    created () {
      if (this.isWrite) {
        this.organizeName = this.detail.organizeName
        this.organizeProfile = this.detail.organizeProfile
      }
    },
    methods: {
      returnData () {
        if (this.organizeName === '') {
          this.warningInfo('请输入机构名称')
          return false
        }
        if (this.organizeProfile === '') {
          this.warningInfo('请输入机构简介')
          return false
        }
        return {
          organizeName: this.organizeName,
          organizeProfile: this.organizeProfile
        }
      }
    }
  }
</script>
<style lang="less">
</style>
