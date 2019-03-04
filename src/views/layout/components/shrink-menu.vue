<template>
  <div class="shrink-menu">
    <sidebar-menu v-if="!shrink" @on-select="changeRoute"></sidebar-menu>
    <!--<sidebar-menu-shrink v-else @on-select="changeRoute"></sidebar-menu-shrink>-->
  </div>
</template>

<script>
  import sidebarMenu from './sidebar-menu'
  import sidebarMenuShrink from './sidebar-menu-shrink'

  export default {
    props: {
      shrink: {
        type: Boolean,
        defalut: false
      }
    },
    components: {
      sidebarMenu,
      sidebarMenuShrink
    },
    methods: {
      changeRoute(routeName) {
        this.$emit('changeRoute', routeName)
      }
    }
  }
</script>

<style lang="less" scoped>
  .shrink-menu {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
