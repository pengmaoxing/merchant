<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <template v-for="item in menuList">
            <el-breadcrumb-item v-if="item.name==='首页'" :key="item.path" :to="item.path">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-else :key="item.path" >{{item.name}}</el-breadcrumb-item>
        </template>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'breadcrumb',
  created () {
    this.getBreadcrumb()
  },
  watch: {
    '$route' () {
      // 对路由变化作出响应
      console.log(this.$route)
      this.getBreadcrumb()
    }
  },
  data () {
    return {
      menuList: null
    }
  },
  methods: {
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      console.log(matched)
      if (matched[0].name !== '首页') {
        matched = [{path: '/index', name: '首页'}].concat(matched)
      }
      console.log(matched)
      this.menuList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 85px;
        margin-left: 10px;
        .no-redirect {
            color: #97a8be;
            cursor: text;
        }
    }
</style>
