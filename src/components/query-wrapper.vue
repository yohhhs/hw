<template>
  <div class="query-wrapper">
    <div v-show="isOpen" class="input-wrapper">
      <slot></slot>
    </div>
    <div v-show="isOpen" class="query-btn">
      <Button type="primary" @click="query">查询</Button>
    </div>
    <span class="turn" @click="trigger">
      <Icon type="ios-reorder" />
    </span>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isOpen: true
      }
    },
    methods: {
      query() {
        this.$emit('userQuery')
      },
      trigger() {
        this.isOpen = !this.isOpen
      }
    }
  }
</script>

<style lang="less" scoped>
  .query-wrapper {
    position: relative;
    margin-bottom: 5px;
    padding: 10px 85px 15px 30px;
    background: #fff;
    &:before {
      content: '';
      position: absolute;
      top: 10px;
      right: 85px;
      bottom: 10px;
      width: 1px;
      background: #f0f0f0;
    }
    .query-btn {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
    .turn {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
