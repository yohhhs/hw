<template>
  <div class="main">
    <div class="main-menu">
      <shrink-menu :shrink="menuShrink" @changeRoute="changePage"></shrink-menu>
    </div>
    <div class="main-header">
      <div class="assist">
        <!--<div @click="switchMenu" style="height: 100%;width: 60px;display: inline-block;text-align: center;line-height: 70px;vertical-align: middle;cursor: pointer" :style="{transform : menuShrink ? 'rotateZ(90deg)' : 'rotateZ(0deg)'}">
          <Icon type="navicon" size="32"></Icon>
        </div>-->
        <span style="line-height:60px;font-size: 28px;">征订易数据管理系统</span>
        <Button style="float: right;margin-top: 14px;margin-right: 28px;" type="error" @click="loginOut">账号退出</Button>
        <span style="float: right;line-height: 60px;margin-right: 28px;">您好，管理员：{{userName}}</span>
      </div>
      <div class="tags-wrapper">
        <tags @changeRoute="changePage"></tags>
      </div>
    </div>
    <div class="main-page">
      <div class="single">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
  import shrinkMenu from './components/shrink-menu'
  import Tags from './components/tags'

  export default {
    data() {
      return {
        menuShrink: false,
        userName: window.localStorage.getItem('user')
      }
    },
    components: {
      shrinkMenu,
      Tags
    },
    methods: {
      switchMenu() {
        this.menuShrink = !this.menuShrink
      },
      goMessage() {
        this.$router.push({name:'message'})
      },
      changePage(routeName) {
        this.$router.push({name: routeName})
      },
      loginOut() {
        this.$emit('loginOut')
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    width: 100%;
    height: 100%;
    &-menu {
       position: fixed;
       top: 60px;
       left: 0;
       width: 200px;
       height: 100%;
       transition: width .3s;
       z-index: 21;
    }
    &-header {
       position: fixed;
       top: 0;
       left: 0;
       padding-left: 20px;
       width: 100%;
       height: 60px;
       transition: padding .3s;
       z-index: 20;
       border-bottom: 5px solid #f0f0f0;
      .assist {
        height: 60px;
        /*box-shadow: 0 2px 1px 1px hsla(0,0%,39%,.1);*/
      }
      .tags-wrapper {
        position: fixed;
        top: 60px;
        left: 200px;
        right: 0;
        height: 40px;
        background: #f0f0f0;
        overflow: hidden;
        box-shadow: 0 2px 1px 1px hsla(0,0%,39%,.1);
        z-index: -1;
      }
    }
    &-page {
     position: absolute;
     top: 100px;
     left: 200px;
     right: 0;
     bottom: 0;
     overflow: auto;
     background: #f0f0f0;
     transition: left .3s;
       .single {
         margin: 10px;
       }
    }
  }
</style>
