<template>
  <div class="btn-wrapper" ref="btnWrapper" v-if="isShow">
    <Button
      style="margin-left: 15px"
      v-if="handleList[$route.name]"
      v-for="handle in handleList[$route.name]"
      :key="handle"
      type="primary"
      @click="handlerClick(handle)">
      {{ handle }}
    </Button>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShow: true
      }
    },
    mounted() {
      if(this.$refs.btnWrapper.innerHTML.length === 1) {
        this.isShow = false
      }
    },
    methods: {
      handlerClick(handle) {
        this.$emit('btnClick', handle)
      }
    }
  }
</script>

<style lang="less" scoped>
  .btn-wrapper {
    margin-bottom: 5px;
    width: 100%;
    padding: 10px 15px;
    background: #fff;
  }
</style>
