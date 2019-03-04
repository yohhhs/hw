<template>
  <div class="sidebar-menu-shrink">
    <div style="height: 65px;text-align: center;padding: 8px 0;">
      <img width="44" src="./menu-shrink-logo.png" alt="">
    </div>
    <template v-for="item in menu">
      <div>
        <Dropdown placement="right-start" @on-click="selectRouter">
          <div style="height: 44px;width: 60px;background: transparent;text-align: center;line-height: 44px;cursor: pointer">
            <Icon :size="25" color="#ffffff" :type="icons[item.route]"></Icon>
          </div>
          <template v-if="item.children">
            <DropdownMenu slot="list">
              <DropdownItem v-for="child in item.children" :key="child.route" :name="child.route">
                {{checkList[child.route]}}
              </DropdownItem>
            </DropdownMenu>
          </template>
          <template v-else>
            <DropdownMenu slot="list">
              <DropdownItem :name="item.route">{{checkList[item.route]}}</DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    methods: {
      selectRouter(routeName) {
        this.$emit('on-select', routeName)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
