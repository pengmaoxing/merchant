<template>
    <div class="app-wrapper" :class="classObj">
        <slidebar class="sidebar-container"></slidebar>
        <div class="main-container">
            <navbar></navbar>
            <tags-view></tags-view>
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
import slidebar from './components/slidebar/index'
import navbar from './components/navbar'
import tagsView from './components/tagsView'
import appMain from './components/appMain'

export default {
  name: 'layout',
  computed: {
    isClosed () {
      return this.$store.getters.isClosed
    },
    classObj () {
      return {
        hideSidebar: this.isClosed,
        openSidebar: !this.isClosed
      }
    }
  },
  components: {
    slidebar,
    navbar,
    tagsView,
    appMain
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        &.mobile.openSidebar{
            position: fixed;
            top: 0;
        }
    }
    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 999;
    }
</style>
