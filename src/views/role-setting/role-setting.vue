<template>
  <div class="role-setting">
    <btn-wrapper @btnClick="handlerClick"></btn-wrapper>
    <div class="container">
      <div class="role-list">
        <Table
          :columns="roleColumns"
          :loading="tableLoading"
          highlight-row
          :data="roleData"
          @on-row-click="clickSingle">
        </Table>
      </div>
      <div class="tree-wrap">
        <Spin fix v-if="isQuest">
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>数据加载中...</div>
        </Spin>
        <div v-if="!currentPermission" class="no-permissions">
          <img src="./notfound.png">
          <p>该角色还未分配权限</p>
        </div>
        <div style="padding: 40px 10px 20px 120px">
          <Input v-if="isWrite" style="width: 200px;margin-bottom: 20px" v-model="writeName" placeholder="请输入角色名"/>
          <check-tree
            ref="checkTree"
            v-if="currentPermission"
            :permissions="currentPermission"
            :checkList="initCheckList"
            :isWrite="isWrite">
          </check-tree>
          <Button v-if="isWrite" type="primary" :loading="writeloading" @click="writeQuery">确定</Button>
        </div>
      </div>
    </div>
    <Modal
      v-model="addRole.isShow"
      title="添加角色">
      <Input v-model="addRole.name" placeholder="请输入角色名称" />
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addRole.loading"  @click="addRoleQuery">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import checkTree from '@/components/check-tree'
  import btnWrapper from '@/components/btn-wrapper'
  import { getRoleList, addRole, deleteRole, changeRole, getInitPermissions } from '@/api/request'
  import { returnCheckTree, checkPermissions } from '@/common/js/util'
  import { message } from '@/common/js/mixins'

  let initPermission, tempPermissions
  export default {
    data() {
      return {
        isWrite: false,
        isQuest: false,
        tableLoading: true,
        writeloading: false,
        currentIndex: -1,
        initCheckList: null,
        currentPermission: null,
        writeName: '',
        addRole: {
          name: '',
          loading: false,
          isShow: false
        },
        roleColumns: [
          {
            title: '名称',
            key: 'name'
          }
        ],
        roleData: [
          {
            name: '超级管理员'
          }
        ]
      }
    },
    components: {
      checkTree,
      btnWrapper
    },
    mixins: [message],
    created() {
      this.getRoleList()
      this.getInitPermissions()
    },
    methods: {
      setFirstRow() {
        this.roleData[0]._highlight = true
        this.currentIndex = 0
        this.isWrite = false
        this.getPermissions()
      },
      getRoleList() {
        this.tableLoading = true
        getRoleList().then(data => {
          if (data !== 'isError') {
            this.roleData = data
            this.tableLoading = false
            this.setFirstRow()
          }
        })
      },
      getInitPermissions() {
        getInitPermissions().then(data => {
          if (data !== 'isError') {
            initPermission = data.permissionsTree
            this.initCheckList = JSON.parse(data.contrast)
          }
        })
      },
      getPermissions() {
        this.isQuest = true
        getInitPermissions({
          roleId: this.roleData[this.currentIndex].id
        }).then(data => {
          if (data !== 'isError') {
            let temp
            if (data.permissionsTree) {
              temp = returnCheckTree(data.permissionsTree, true)
            } else {
              temp = data.permissionsTree
            }
            tempPermissions = data.permissionsTree
            temp.forEach(item => {
              if (item.children) {
                item.openList = false
              }
            })
            this.currentPermission = temp
          }
          this.isQuest = false
        }).catch(err => {
          this.isQuest = false
        })
      },
      handlerClick(btnType) {
        switch (btnType) {
          case '添加':
            this.addRole.isShow = true
            break;
          case '编辑':
            if (this.roleData.length === 0) {
              return this.warningInfo('没有可编辑的角色')
            }
            if (this.isWrite) {
              return this.warningInfo('当前正处于编辑状态')
            }
            this.isWrite = true
            this.writeName = this.roleData[this.currentIndex].name
            let temp = checkPermissions(tempPermissions, initPermission)
            temp.forEach(item => {
              if (item.children) {
                item.openList = false
              }
            })
            this.currentPermission = temp
            break;
          case '删除':
            deleteRole({
              id: this.roleData[this.currentIndex].id
            }).then(data => {
              if (data !== 'isError') {
                this.roleData.splice(this.currentIndex, 1)
                this.successInfo('删除成功')
                this.setFirstRow()
              }
            }).catch(err => {
            })
            break;
        }
      },
      addRoleQuery() {
        if (this.addRole.name) {
          this.addRole.loading = true
          addRole({
            name: this.addRole.name
          }).then(data => {
            if (data !== 'isError') {
              this.successInfo('修改成功')
              this.addRole.loading = false
              this.addRole.isShow = false
              this.addRole.name = ''
              this.getRoleList()
            }
          }).catch(err => {
            this.addRole.loading = false
          })
        } else {
          this.warningInfo('角色信息不能为空')
        }
      },
      clickSingle(row, i) {
        this.currentIndex = i
        this.isWrite = false
        this.getPermissions()
      },
      writeQuery() {
        this.writeloading = true
        changeRole({
          id: this.roleData[this.currentIndex].id,
          name: this.writeName,
          permissions: JSON.stringify(this.$refs.checkTree.returnTree())
        }).then(data => {
          if (data !== 'isError') {
            this.writeloading = false
            this.isWrite = false
            this.roleData[this.currentIndex].name = this.writeName
            this.getPermissions()
          }
        }).catch(err => {
          this.writeloading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .role-setting {
    .container {
      position: absolute;
      top: 67px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      overflow: hidden;
      .role-list {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 35%;
        overflow: auto;
      }
      .tree-wrap {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 65%;
        overflow: auto;
        background: #e9eaec;
        border: 10px solid #e9eaec;
        .no-permissions {
          padding-top: 20px;
          line-height: 50px;
          text-align: center;
          font-size: 14px;
        }
        .demo-spin-icon-load{
          animation: ani-demo-spin 1s linear infinite;
        }
        @keyframes ani-demo-spin {
          from { transform: rotate(0deg);}
          50%  { transform: rotate(180deg);}
          to   { transform: rotate(360deg);}
        }
        .demo-spin-col{
          height: 100px;
          position: relative;
          border: 1px solid #eee;
        }
      }
    }
  }
</style>
