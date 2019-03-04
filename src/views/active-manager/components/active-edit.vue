<template>
  <div class="active-edit">
    <div class="modal-input-item">
      <p class="label">活动名称</p>
      <div style="width: 350px">
        <Input v-model="activityName" placeholder="请输入活动名称" />
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">活动开始时间</p>
      <div style="width: 350px">
        <DatePicker
          style="width: 350px" :value="startTime"
          type="datetime" placeholder="活动开始时间"
          @on-change="activeStartChange"></DatePicker>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">活动结束时间</p>
      <div style="width: 350px">
        <DatePicker
          style="width: 350px" :value="endTime"
          type="datetime" placeholder="活动结束时间"
          @on-change="activeEndChange"></DatePicker>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">活动类型</p>
      <div style="width: 350px">
        <Select v-model="activityType" placeholder="选择活动类型">
          <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">活动地址</p>
      <div style="width: 350px">
        <Input v-model="addressDetail" placeholder="请输入活动地址" />
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">活动备注</p>
      <div style="width: 350px">
        <Input v-model="remark" type="textarea" :rows="3" placeholder="请输入活动备注" />
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
          activityName: '',
          activityType: '',
          startTime: '',
          endTime: '',
          addressDetail: '',
          remark: '',
          typeList: [
            {
              id: 1,
              name: 'h5活动'
            },
            {
              id: 2,
              name: '问卷'
            }
          ]
        }
    },
    mixins: [message],
    created () {
      if (this.isWrite) {
        this.activityName = this.detail.activityName
        this.activityType = this.detail.activityType
        this.startTime = this.detail.startTime
        this.endTime = this.detail.endTime
        this.addressDetail = this.detail.addressDetail
        this.remark = this.detail.remark
      }
    },
    methods: {
      activeStartChange (time) {
        this.startTime = time
      },
      activeEndChange (time) {
        this.endTime = time
      },
      returnData () {
        if (this.activityName === '') {
          this.warningInfo('请输入活动名称')
          return
        }
        if (this.activityType === '') {
          this.warningInfo('请输入活动类型')
          return
        }
        if (this.startTime === '') {
          this.warningInfo('请选择活动开始时间')
          return
        }
        if (this.endTime === '') {
          this.warningInfo('请选择活动结束时间')
          return
        }
        if (this.addressDetail === '') {
          this.warningInfo('请输入活动地址')
          return
        }
        return {
          activityName: this.activityName,
          activityType: this.activityType,
          startTime: this.startTime,
          endTime: this.endTime,
          addressDetail: this.addressDetail,
          remark: this.remark
        }
      }
    }
  }
</script>
<style lang="less" scope>
</style>
