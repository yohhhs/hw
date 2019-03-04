<template>
  <div ref="tags" class="tags">
    <div ref="tagsList" class="tags-list" :style="{left: leftDistance + 'px'}">
      <template v-for="tag in tagsList">
        <Tag
          type="dot"
          :color="tag[0] === currentRoute?'primary':''"
          :closable="tag[0] !== 'home-index'"
          style="margin-left: -3px"
          :name="tag[0]"
          @on-close="closeTag"
          @click.native="onSelect(tag[0])"
        >
          {{tag[1]}}
        </Tag>
      </template>
    </div>
    <div class="tags-go-left" @click="goLeft">
      <Button type="text" style="height: 100%">
        <Icon type="ios-arrow-back" size="20"></Icon>
      </Button>
    </div>
    <div class="tags-go-right" @click="goRight">
      <Button type="text" style="height: 101%">
        <Icon type="ios-arrow-forward" size="20"></Icon>
      </Button>
    </div>
    <div class="tags-btn">
      <Dropdown transfer @on-click="closePage">
        <Button type="primary" size="small">
          更多操作
          <Icon type="md-arrow-dropdown"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="other">关闭其他</DropdownItem>
          <DropdownItem name="all">关闭所有</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { closeTag, closePage } from '@/common/js/util'

  export default {
    data() {
      return {
        leftDistance: 0
      }
    },
    computed: {
      ...mapGetters(['tagsList', 'currentRoute'])
    },
    methods: {
      closeTag(even, name) {
        closeTag(this, name)
      },
      onSelect(routeName) {
        this.$emit('changeRoute', routeName)
      },
      closePage(name) {
        this.leftDistance = 0
        closePage(this, name)
      },
      goLeft() {
        let tagsWidth = this.$refs.tags.offsetWidth - 200
        if (this.leftDistance >= 0) {
          return
        }
        if (-this.leftDistance >= tagsWidth) {
          this.leftDistance += tagsWidth
        } else {
          this.leftDistance = 0
        }
      },
      goRight() {
        let tagsWidth = this.$refs.tags.offsetWidth - 200
        let listWidth = this.$refs.tagsList.offsetWidth
        let distance = listWidth - tagsWidth + this.leftDistance
        if (distance <= 0) {
          return
        }
        if (distance >= tagsWidth) {
          this.leftDistance -= tagsWidth
        } else {
          this.leftDistance -= distance
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .tags {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-bottom: 5px;
    &-list {
      position: absolute;
      top: 0;
      bottom: 0;
      padding-left: 55px;
      white-space: nowrap;
      transition: left 0.2s;
    }
    &-btn {
      position: absolute;
      width: 110px;
      height: calc(~'100% - 5px');
      text-align: center;
      line-height: 35px;
      right: 0;
      top: 0;
      background: #fff;
      z-index: 9;
    }
    &-go-left, &-go-right {
      position: absolute;
      top: 0;
      width: 40px;
      height: calc(~'100% - 5px');
      background: #fff;
    }
    &-go-left {
      left: 0;
    }
    &-go-right {
      right: 110px;
      border-left: 1px solid #f0f0f0;
      border-right: 1px solid #f0f0f0;
    }
  }
</style>
