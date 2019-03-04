<template>
    <div class="supplier-edit">
      <div class="modal-input-item">
        <p class="label"><span class="require-flag">*</span>商品专区名称</p>
        <div style="width: 350px">
          <Input type="text" long v-model="name" placeholder="请输入商品专区名称" />
        </div>
      </div>
      <div class="modal-input-item">
        <p class="label"><span class="require-flag">*</span>商品专区权重</p>
        <div style="width: 350px">
          <InputNumber style="width: 100%" :min="0" v-model="sort"></InputNumber>
        </div>
      </div>
    </div>
</template>
<script>
  import { message } from '@/common/js/mixins'

  export default {
    props: {
      isWrite: {
        type: Boolean,
        default: false
      },
      detail: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        name: '',
        sort: 0
      }
    },
    mixins: [message],
    created () {
      if (this.isWrite) {
        this.name = this.detail.goodsSpecialName
        this.sort = this.detail.sort
      }
    },
    methods: {
      returnData () {
        if (this.name === '') {
          this.warningInfo('请输入商品专区名称')
          return false
        }
        if (this.sort === '') {
          this.warningInfo('请输入商品专区权重')
          return false
        }
        return {
          name: this.name,
          sort: this.sort
        }
      }
    }
  }
</script>
<style lang="less" scope>
  .modal-input-item .label {
    width: 120px;
  }
</style>
