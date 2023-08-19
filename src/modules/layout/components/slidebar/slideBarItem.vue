<template>
    <div class="menu-wrapper">
        <el-submenu :index="item.path" v-if="item.visible === 1">
            <template slot="title">
                <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
                <span>{{item.name}}</span>
            </template>
            <router-link  :to="resolvePath(i.path)"  v-for="i in item.children" :key="i.name" v-if="i.visible === 1">
                <el-menu-item :index="resolvePath(i.path)">
                    <svg-icon v-if="i.icon" :icon-class="i.icon"></svg-icon>
                    <span slot="title">{{i.name}}</span>
                </el-menu-item>
            </router-link>
        </el-submenu>
    </div>
</template>

<script>
import path from 'path'

export default {
  name: 'slideBarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    baseUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    resolvePath (pa) {
      return path.resolve(this.baseUrl, pa)
    }
  }
}
</script>

<style >


</style>
