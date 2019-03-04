<template>
  <div class="query-wrapper">
    <div class="input-wrapper">
      <slot></slot>
    </div>
    <div class="query-btn">
      <Button type="primary" @click="query">查询</Button>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      query() {
        this.$emit('userQuery')
      }
    }
  }
</script>

<style lang="less" scoped>
  .query-wrapper {
    position: relative;
    margin-bottom: 5px;
    padding: 10px 85px 10px 30px;
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
  }
</style>
