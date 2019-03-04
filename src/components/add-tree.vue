<template>
  <div class="add-tree">
    <li class="tree-list-item">
      <div class="level">
        <Button v-if="isFolder" class="toggle" type="text" @click="toggle" style="" :style="{transform : open ? 'rotateZ(90deg)' : 'rotateZ(0deg)'}">
          <Icon type="md-arrow-dropright" size="18"></Icon>
        </Button>
        {{model.name}}
        <span class="level-name">
          <Icon :style="iconStyle" color="#19be6b"  type="md-arrow-dropdown" @click.native="addChild"/>
          <Icon v-if="!isFolder" :style="iconStyle" color="#2D8cF0" type="md-add" @click.native="addHandle"/>
          <Icon :style="iconStyle" color="#f90" type="md-create" @click.native="editRoute"/>
          <Icon :style="iconStyle" color="#ed3f14" type="md-close" @click.native="closeRoute(model.route)"/>
        </span>
        <template v-if="hasHandle">
          <span
            v-for="(item, i) in model.handles"
            v-dragging="{ item: item, list: model.handles, group: model.route}"
            class="level-handle">
          {{ item }}
          <Icon :style="iconStyle" color="#f90" type="md-create" @click.native="editHandle(i)"/>
          <Icon :style="iconStyle" color="#ed3f14" type="md-close" @click.native="closeHandle(i)"/>
        </span>
        </template>
      </div>
      <ul v-show="open" class="child-list" v-if="isFolder">
        <add-tree
          @delItem="delItem"
          v-for="(child, index) in model.children"
          v-dragging="{ item: child, list: model.children, group: 'drogChildren'}"
          :key="index"
          :model="child">
        </add-tree>
      </ul>
    </li>
  </div>
</template>

<script>
  import {message} from '@/common/js/mixins'

  export default {
    name: 'addTree',
    props: {
      model: Object
    },
    data() {
      return {
        open: false,
        addRoutePath: '',
        addRouteName: '',
        writeRoutePath: '',
        writeRouteName: '',
        addHandleName: '',
        writeHandleName: '',
        iconStyle: 'margin-left: 8px;cursor: pointer;'
      }
    },
    computed: {
      isFolder: function () {
        return this.model.children && this.model.children.length
      },
      hasHandle: function() {
        return this.model.handles && this.model.handles.length
      }
    },
    mixins: [message],

    methods: {
      toggle() {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      delItem(route) {
        let index
        this.model.children.forEach((item, i) => {
          if (item.route == route) {
            index = i
          }
        })
        this.model.children.splice(index, 1)
        if (this.model.children.length === 0) {
          delete this.model.children
        }
      },
      addChild() {
        this.addRouteName = ''
        this.addRoutePath = ''
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('Input', {
                props: {
                  value: this.addRouteName,
                  autofocus: true,
                  placeholder: '请输入菜单名称'
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
                  placeholder: '请输入菜单路由地址'
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
              return this.warningInfo('菜单名称不能为空')
            }
            if (this.addRoutePath === '') {
              return this.warningInfo('菜单路由不能为空')
            }
            if (!this.isFolder) {
              this.$set(this.model, 'children', [])
              this.open = true
            }
            this.model.children.push({
              name: this.addRouteName,
              route: this.addRoutePath
            })
          }
        })
      },
      editRoute() {
        this.writeRouteName = this.model.name
        this.writeRoutePath = this.model.route
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('Input', {
                props: {
                  value: this.model.name,
                  autofocus: true,
                  placeholder: '请输入二级菜单名称'
                },
                style: {
                  marginBottom: '15px'
                },
                on: {
                  input: (val) => {
                    this.writeRouteName = val;
                  }
                }
              }),
              h('Input', {
                props: {
                  value: this.model.route,
                  autofocus: true,
                  placeholder: '请输入二级菜单路由地址'
                },
                on: {
                  input: (val) => {
                    this.writeRoutePath = val;
                  }
                }
              })
            ])
          },
          onOk: () => {
            if (this.writeRouteName === '') {
              return this.warningInfo('二级菜单名称不能为空')
            }
            if (this.writeRoutePath === '') {
              return this.warningInfo('二级菜单路由不能为空')
            }
            this.model.name = this.writeRouteName
            this.model.route = this.writeRoutePath
          }
        })
      },
      closeRoute(route) {
        this.$emit('delItem', route)
      },
      addHandle() {
        this.addHandleName = ''
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: this.addHandleName,
                autofocus: true,
                placeholder: '请输入操作名称'
              },
              on: {
                input: (val) => {
                  this.addHandleName = val;
                }
              }
            })
          },
          onOk: () => {
            if (this.addHandleName === '') {
              return this.warningInfo('操作名称不能为空')
            }
            if (!this.hasHandle) {
              this.$set(this.model, 'handles' ,[])
            }
            this.model.handles.push(this.addHandleName)
          }
        })
      },
      editHandle(i) {
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: this.model.handles[i],
                autofocus: true,
                placeholder: '请输入操作名称'
              },
              on: {
                input: (val) => {
                  this.writeHandleName = val;
                }
              }
            })
          },
          onOk: () => {
            if (this.writeHandleName === '') {
              return this.warningInfo('操作名称不能为空')
            }
            this.model.handles[i] = this.writeHandleName
            this.$set(this.model.handles, this.model.handles)
          }
        })
      },
      closeHandle(i) {
        this.model.handles.splice(i ,1)
        if (this.model.handles.length === 0) {
          delete this.model.handles
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .child-list {
    margin-left: 50px;
  }
  .toggle {
    outline:none;
    position:absolute;
    top: -3px;
    left: -40px;
    width:40px;
    height: 40px;
    border: none
  }
  .tree-list {
    font-size: 14px;
    overflow: hidden;
    &-item {
      padding-left: 40px;
      margin: 15px 0;
      list-style: none;
      .level {
        position: relative;
        line-height: 35px;
        &-name {
          display: inline-block;
          width: 240px;
        }
        &-handle {
          display: inline-block;
          margin-right: 25px;
          padding: 0 12px;
          line-height: 33px;
          border: 1px solid #e9eaec;
          border-radius: 4px;
        }
      }
      .two-level {
        margin: 5px 0;
        .level-name {
          padding-left: 50px;
        }
      }
    }
  }
</style>
