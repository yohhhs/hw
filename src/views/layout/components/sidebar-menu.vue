<template>
  <div class="sidebar-menu">
    <!--<div style="height: 65px;text-align: center;padding: 8px 0;" @click="openDevelop">
      <img height="44" style="border-radius: 5px" src="./menu-logo.png" alt="">
    </div>-->
    <Menu ref="menu" theme="primary" width="auto" accordion @on-select="selectRouter" :active-name="currentRoute">
      <template v-for="item in menu">
        <template v-if="item.children">
          <Submenu :name="item.route">
            <template slot="title">
              {{checkList[item.route]}}
            </template>
            <template v-for="child in item.children">
              <MenuItem :key="child.route" :name="child.route">
                {{checkList[child.route]}}
              </MenuItem>
            </template>
          </Submenu>
        </template>
        <template v-else>
          <MenuItem :name="item.route">
            <span>{{checkList[item.route]}}</span>
          </MenuItem>
        </template>
      </template>
    </Menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dark: 'dark',
      clock: 0
    }
  },
  computed: {
    ...mapGetters(['currentRoute'])
  },
  methods: {
    selectRouter(routeName) {
      this.$emit('on-select', routeName)
    },
    openDevelop() {
      if (this.clock === 7) {
        return
      }
      this.clock++
      if (this.clock === 7) {
        let develop = JSON.parse(window.sessionStorage.getItem('yms-develop'))
        if (develop) {
          this.menu.push(...develop)
        }
      } else {
        setTimeout(() => {
          this.clock = 0
        }, 3000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
