<template>
  <div class="user-setting">
    <!--<query-wrapper @userQuery="userQuery">
      <Row>
        <Col :lg="6" :md="8">
          <Input :style="inputStyle" type="text" placeholder=""/>
        </Col>
      </Row>
    </query-wrapper>-->
    <btn-wrapper  @btnClick="handlerClick"></btn-wrapper>
    <Table
      :columns="userTable.columns"
      :loading="userTable.loading"
      :data="userTable.data"
      @on-selection-change="tableSelectChange">
    </Table>
    <Modal
      v-model="addUser.modal"
      :mask-closable="false"
      @on-cancel="addUserCancel"
      title="添加用户">
      <Input :style="modleStyle" v-model="addUser.phone" placeholder="请输入手机号" />
      <Input :style="modleStyle" type="password" v-model="addUser.password" placeholder="请输入密码" />
      <Input :style="modleStyle" v-model="addUser.name" placeholder="请输入使用者姓名" />
      <Select v-model="addUser.bCmsRoleId">
        <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addUser.loading"  @click="addUserQuery">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="writeUser.modal"
      :mask-closable="false"
      @on-cancel="writeUserCancel"
      title="修改用户">
      <Input :style="modleStyle" type="password" v-model="writeUser.password" placeholder="请输入密码" />
      <Input :style="modleStyle" v-model="writeUser.name" placeholder="请输入使用者姓名" />
      <Select v-model="writeUser.bCmsRoleId">
        <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeUser.loading"  @click="writeUserQuery">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import btnWrapper from '@/components/btn-wrapper'
import queryWrapper from '@/components/query-wrapper'
import { message } from '@/common/js/mixins'
import {
  getRoleList,
  addUser,
  queryUserById,
  getUserInfo,
  updateUserInfo,
  updateUserState,
  deleteUser
} from '@/api/request'

export default {
  data() {
    return {
      inputStyle: 'width: 200px; margin: 10px 0;',
      modleStyle: 'margin-bottom: 15px',
      currentUserIndex: -1,
      currentUser: [],
      isDelete: false,
      currentId: '',
      addUser: {
        modal: false,
        password: '',
        phone: '',
        bCmsRoleId: '',
        name: '',
        loading: false
      },
      writeUser: {
        modal: false,
        password: '',
        bCmsRoleId: '',
        name: '',
        loading: false
      },
      userTable: {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户名称',
            key: 'phone'
          },
          {
            title: '使用者姓名',
            key: 'cmsUserName'
          },
          {
            title: '使用者电话',
            key: 'phone'
          },
          {
            title: '所属角色',
            key: 'phone'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.writeUser.modal = true
                      this.currentId = params.row.id
                      this.writeUser.password = ''
                      this.writeUser.name = params.row.cmsUserName
                      this.writeUser.bCmsRoleId = params.row.cmsRoleId
                    }
                  }
                }, '编辑')
              ])
            }
          }
        ],
        data: [],
        loading: false
      },
      roleList: []
    }
  },
  components: {
    btnWrapper,
    queryWrapper
  },
  mixins: [message],
  created() {
    this.getRoleList()
    this.getUserList()
  },
  methods: {
    userQuery() {},
    getRoleList() {
      getRoleList().then(data => {
        if (data !== 'isError') {
          this.roleList = data
        }
      })
    },
    getUserList() {
      this.userTable.loading = true
      queryUserById()
        .then(data => {
          if (data !== 'isError') {
            this.userTable.data = data
          }
          this.userTable.loading = false
        })
        .catch(err => {
          this.userTable.loading = false
        })
    },
    handlerClick(btnType) {
      switch (btnType) {
        case '添加':
          this.addUser.modal = true
          break
        case '删除':
          if (this.currentUser.length === 0) {
            return this.warningInfo('请选择一条用户信息')
          }
          deleteUser({
            id: this.currentUser.toString()
          })
            .then(data => {
              if (data !== 'isError') {
                this.successInfo('删除用户成功')
                this.getUserList()
                this.currentUser = []
              }
            })
            .catch(err => {
            })
          break
      }
    },
    addUserQuery() {
      let phone = this.addUser.phone
      let password = this.addUser.password
      let bCmsRoleId = this.addUser.bCmsRoleId
      let name = this.addUser.name
      if (phone === '' && password === '' && bCmsRoleId === '' && name === '') {
        return this.warningInfo('内容不能为空')
      }
      if (!/^1[34578]\d{9}$/.test(phone)) {
        return this.warningInfo('手机号格式不正确')
      }
      if (!/^[a-zA-Z0-9_]{6,16}$/.test(password)) {
        return this.warningInfo('密码由6-16位的字母、数字或_组成')
      }
      this.addUser.loading = true
      addUser({
        phone,
        password,
        bCmsRoleId,
        name
      })
        .then(data => {
          if (data !== 'isError') {
            this.successInfo('添加用户成功')
            this.clearAddUserData()
            this.addUser.modal = false
            this.getUserList()
          }
          this.addUser.loading = false
        })
        .catch(err => {
          this.addUser.loading = false
        })
    },
    clearAddUserData() {
      this.addUser.phone = ''
      this.addUser.password = ''
      this.addUser.bCmsRoleId = ''
      this.addUser.nickName = ''
    },
    writeUserQuery() {
      let password = this.writeUser.password
      let bCmsRoleId = this.writeUser.bCmsRoleId
      let name = this.writeUser.name
      let id = this.currentId
      if (name === '') {
        return this.warningInfo('名称不能为空')
      }
      if (password !== '' && !/^[a-zA-Z0-9_]{6,16}$/.test(password)) {
        return this.warningInfo('密码由6-16位的字母、数字或_组成')
      }
      this.writeUser.loading = true
      updateUserInfo({
        id,
        password,
        bCmsRoleId,
        name
      })
        .then(data => {
          if (data !== 'isError') {
            this.successInfo('修改用户信息成功')
            this.getUserList()
            this.writeUser.modal = false
          }
          this.writeUser.loading = false
        })
        .catch(err => {
          this.writeUser.loading = false
        })
    },
    tableSelectChange(selection) {
      let ids = []
      selection.forEach(item => {
        ids.push(item.id)
      })
      this.currentUser = ids
    },
    addUserCancel() {
      this.clearAddUserData()
    },
    writeUserCancel() {}
  }
}
</script>

<style lang="less" scoped>
.user-setting {
}
</style>
