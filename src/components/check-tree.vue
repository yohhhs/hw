<template>
  <div class="tree">
    <ul class="node-tree">
      <li
        class="item"
        v-for="(rule, parentIndex) in permissions"
        :key="rule.route">
        <div v-if="rule.children" type="text" @click="openChild(parentIndex)" style="position:absolute;top: -4px;left: -35px;width:30px;height: 30px;line-height: 30px;text-align: center" :style="{transform : rule.openList ? 'rotateZ(90deg)' : 'rotateZ(0deg)'}">
          <Icon type="md-arrow-dropright" size="24"></Icon>
        </div>
        <Checkbox
          v-if="isWrite"
          @on-change="parentBox(parentIndex)"
          v-model="rule.lookAuth">
          {{checkList[rule.route]}}
        </Checkbox>
        <Checkbox
          v-else
          disabled
          :value="true">
          {{checkList[rule.route]}}
        </Checkbox>
        <!--<template v-else>
          {{checkList[rule.route]}}
        </template>-->
        <span class="parenth" v-if="rule.handles">
          <template v-for="handle in rule.handles">
            <Checkbox
              v-if="isWrite"
              :disabled="!rule.lookAuth"
              v-model="handle.turn"
            >
              {{handle.name}}
            </Checkbox>
            <Checkbox
              v-else
              disabled
              :value="true"
            >
              {{handle.name}}
            </Checkbox>
            <!--<template v-else>
              <span style="margin-right: 10px">{{handle.name}}</span>
            </template>-->
          </template>
        </span>
        <ul class="child-node" v-if="rule.children" v-show="rule.openList">
          <li class="child-item" v-for="(child, childIndex) in rule.children"  :key="child.route">
                <span>
                    <Checkbox
                      v-if="isWrite"
                      @on-change="childBox(parentIndex, childIndex)"
                      v-model="child.lookAuth"
                    >
                      {{checkList[child.route]}}
                    </Checkbox>
                    <Checkbox
                      v-else
                      disabled
                      :value="true"
                    >
                      {{checkList[child.route]}}
                    </Checkbox>
                  <!--<template v-else>
                    {{checkList[child.route]}}
                  </template>-->
                </span>
            <span class="childh" v-if="child.handles">
                    <template v-for="handle in child.handles">
                      <Checkbox
                        v-if="isWrite"
                        :disabled="!child.lookAuth"
                        v-model="handle.turn"
                      >
                        {{handle.name}}
                      </Checkbox>
                      <Checkbox
                        v-else
                        disabled
                        :value="true"
                      >
                        {{handle.name}}
                      </Checkbox>
                      <!--<template v-else>
                        <span style="margin-right: 10px">{{handle.name}}</span>
                      </template>-->
                    </template>
                </span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      permissions: {
        type: Array,
        default: null
      },
      checkList: {
        type: Object,
        default: null
      },
      isWrite: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      openChild (index) {
        this.permissions[index].openList = !this.permissions[index].openList
      },
      parentBox (index) {
        if (this.permissions[index].lookAuth === false) {
          if (this.permissions[index].children) {
            this.permissions[index].children.forEach(function (item) {
              item.lookAuth = false
            })
          }
        } else {
          if (this.permissions[index].children) {
            this.permissions[index].children.forEach(function (item) {
              item.lookAuth = true
            })
          }
        }
      },
      childBox (pindex, cindex) {
        if (this.permissions[pindex].children[cindex].lookAuth === true) {
          this.permissions[pindex].lookAuth = true
        } else {
          let activeNum = 0
          this.permissions[pindex].children.forEach(function (item) {
            if (item.lookAuth === true) {
              activeNum++
            }
          })
          if (activeNum === 0) {
            this.permissions[pindex].lookAuth = false
          }
        }
      },
      returnTree() {
        let copyPermissions = this.permissions.slice()
        let returPermissions = []
        copyPermissions.forEach(permission => {
          if (permission.lookAuth === true) {
            let tp = {
              route: permission.route
            }
            if (permission.children) {
              tp.children = []
              permission.children.forEach(child => {
                if (child.lookAuth === true) {
                  let cp = {
                    route: child.route
                  }
                  if (child.handles) {
                    cp.handles = []
                    child.handles.forEach(handle => {
                      if (handle.turn === true) {
                        cp.handles.push(handle.name)
                      }
                    })
                    if (cp.handles.length === 0) {
                      delete cp.handles
                    }
                  }
                  tp.children.push(cp)
                }
              })
              if (tp.children.length === 0) {
                delete tp.children
              }
            } else if (permission.handles) {
              tp.handles = []
              permission.handles.forEach(handle => {
                if (handle.turn === true) {
                  tp.handles.push(handle.name)
                }
              })
              if (tp.handles.length === 0) {
                delete tp.handles
              }
            }
            returPermissions.push(tp)
          }
        })
        if (returPermissions.length === 0) {
          returPermissions = ''
        }
        return returPermissions
      }
    }
  }
</script>

<style lang="less" scoped>
  .tree {
    .node-tree {
      .item {
        list-style: none;
        position: relative;
        margin-bottom: 20px;
        .parenth {
          margin-left: 40px;
        }
      }
    }
    .child-node {
      padding-left: 25px;
      .child-item {
        display: flex;
        margin-top: 8px;
        .childh {
          margin-left: 40px;
        }
      }
    }
  }
</style>
