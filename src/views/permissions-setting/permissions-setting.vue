<template>
  <div class="permissions-setting">
    <Button type="info" @click="addOneLevel">添加一级菜单</Button>
    <Button style="margin-left: 10px" type="info" @click="changePermissions">确定</Button>
    <ul>
      <add-tree
        @delItem="delItem"
        v-for="(model, index) in permissions"
        v-dragging="{ item: model, list: permissions, group: 'drog'}"
        :key="index"
        :model="model">
      </add-tree>
    </ul>
  </div>
</template>

<script>
  import { getInitPermissions, changeInitPermissions } from '@/api/request'
  import addTree from '@/components/add-tree'
  import {message} from '@/common/js/mixins'

  export default {
    data() {
      return {
        permissions: [],
        contrast: null,
        addRouteName: '',
        addRoutePath: ''
      }
    },
    components: {
      addTree
    },
    mixins: [message],
    created() {
      this.getPrimissions()
    },
    methods: {
      getPrimissions() {
        getInitPermissions().then(data => {
          if (data !== 'isError') {
            let permissions = JSON.parse(data.permissionsTree)
            this.contrast = JSON.parse(data.contrast)
            this.setName(permissions)
            console.log(permissions)
            this.permissions = permissions
          }
        })
      },
      setName(list) {
        list.forEach(item => {
          item.name = this.contrast[item.route]
          if (item.children && item.children.length > 0) {
            this.setName(item.children)
          }
        })
      },
      changePermissions() {
        let contrast = {}
        let permissionsTree = JSON.parse(JSON.stringify(this.permissions))
        permissionsTree.forEach(item => {
          contrast[item.route] = item.name
          delete item.name
          if (item.children) {
            item.children.forEach(child => {
              contrast[child.route] = child.name
              delete child.name
            })
          }
        })

        changeInitPermissions({
          permissionsTree: JSON.stringify(permissionsTree),
          contrast: JSON.stringify(contrast)
        }).then(data => {
          if (data !== 'isError') {
            this.$Notice.success({
              title: '修改权限成功',
              duration: 2.5
            })
          }
        })
      },
      delItem(route) {
        let index
        this.permissions.forEach((item, i) => {
          if (item.route == route) {
            index = i
          }
        })
        this.permissions.splice(index, 1)
      },
      addOneLevel() {
        this.addRouteName = ''
        this.addRoutePath = ''
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('Input', {
                props: {
                  value: this.addRouteName,
                  autofocus: true,
                  placeholder: '请输入一级菜单名称'
                },
                style: {
                  marginBottom: '15px'
                },
                on: {
                  input: (val) => {
                    this.addRouteName = val;
                  }
                }
              }),
              h('Input', {
                props: {
                  value: this.addRoutePath,
                  autofocus: true,
                  placeholder: '请输入一级菜单路由地址'
                },
                on: {
                  input: (val) => {
                    this.addRoutePath = val;
                  }
                }
              })
            ])
          },
          onOk: () => {
            if (this.addRouteName === '') {
              return this.warningInfo('一级菜单名称不能为空')
            }
            if (this.addRoutePath === '') {
              return this.warningInfo('一级菜单路由不能为空')
            }
            this.permissions.push({
              name: this.addRouteName,
              route: this.addRoutePath
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .permissions-setting {
    padding: 20px;
    background: #fff;
  }
</style>

<!--
<template>
  <div class="permissions-setting">
    <add-tree
      :permissions="permissions"
      :checkList="contrast"
      @changePermissions="changePermissions"
    >
    </add-tree>
  </div>
</template>

<script>
  import { getInitPermissions, changeInitPermissions } from '@/api/request'
  import addTree from '@/components/add-tree'

  export default {
    data() {
      return {
        permissions: [],
        contrast: null
      }
    },
    components: {
      addTree
    },
    created() {
      this.getPrimissions()
    },
    methods: {
      getPrimissions() {
        getInitPermissions().then(data => {
          if (data !== 'isError') {
            this.contrast = JSON.parse(data.contrast)
            this.permissions = JSON.parse(data.permissionsTree)
          }
        })
      },
      changePermissions(permissionsTree, contrast) {
        changeInitPermissions({
          permissionsTree,
          contrast
        }).then(data => {
          if (data !== 'isError') {
            this.$Notice.success({
              title: '修改权限成功',
              duration: 2.5
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .permissions-setting {
    background: #fff;
  }
</style>
-->
