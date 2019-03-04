<template>
  <div class="inside-edit">
    <div class="modal-input-item">
      <p class="label">姓名</p>
      <div style="width: 350px">
        <Input type="text" long v-model.trim="name" placeholder="请输入姓名" />
      </div>
    </div>
    <div v-if="!isWrite" class="modal-input-item">
      <p class="label">账号</p>
      <div style="width: 350px">
        <Input type="text" long v-model.trim="mobile" placeholder="请输入账号" />
      </div>
    </div>
    <div class="modal-input-item">
      <p class="label">登录密码</p>
      <div style="width: 350px">
        <Input type="password" long v-model.trim="password" placeholder="请输入登录密码" />
      </div>
    </div>
    <div v-if="isWrite" class="modal-input-item">
      <p class="label">状态</p>
      <div style="width: 350px">
        <Select v-model="status" placeholder="选择状态">
          <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
    </div>
  </div>
</template>

<script>
  import {message} from '@/common/js/mixins'

  export default {
    name: "inside-edit",
    props: {
      isWrite: {
        type: Boolean,
        default: false
      },
      detail: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        password: '',
        name: '',
        mobile: '',
        status: '',
        statusList: [
          {
            id: 1,
            name: '启用'
          },
          {
            id: 2,
            name: '停用'
          }
        ]
      }
    },
    mixins: [message],
    created () {
      if (this.isWrite) {
        this.name = this.detail.name
        this.status = this.detail.status
      }
    },
    methods: {
      returnData() {
        if (this.name === '') {
          this.warningInfo('请输入姓名')
          return false
        }
        if (!this.isWrite && this.mobile === '') {
          this.warningInfo('请输入账号')
          return false
        }
        if (!this.isWrite && this.password === '') {
          this.warningInfo('请输入密码')
          return false
        }
        return {
          name: this.name,
          password: this.password,
          mobile: this.mobile,
          status: this.status
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
