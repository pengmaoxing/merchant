<template>
  <div class="shadow">
    <div class="logo" v-if="!isClosed">
      <img v-if="siteInfo.logo" :src="siteInfo.logo" alt="">
      <img v-else src="@/assets/images/login/noimg.png" alt="" style="height: 60px;width: auto">
    </div>

    <el-menu
      class="el-menu-vertical"
      :default-active="$route.path"
      :collapse="isClosed"
      background-color="#fff"
      text-color="#666"
      active-text-color="#FF803E"
      style="overflow: auto">
      <!--固定首页-->
      <router-link :to="resolvePath('/')">
        <el-menu-item :index="resolvePath('/')">
          <svg-icon icon-class="index"></svg-icon>
          <span slot="title">首页</span>
        </el-menu-item>
      </router-link>
      <!--固定首页-->
      <slide-bar-item v-for="item in menuList" :key="item.name" :item="item" :base-url="item.path"></slide-bar-item>
    </el-menu>
  </div>
</template>

<script>
  import slideBarItem from './slideBarItem'
  import {getMenu} from '@/modules/system/api/menu'
  import path from 'path'
  import {mapGetters} from 'vuex'

  export default {
    components: {slideBarItem},
    name: 'index',
    data() {
      return {
        menuList: [],
        siteInfo: {
          logo: ''
        },
      }
    },
    created() {
      this.getMenuList()
    },
    mounted() {
      //设置LOGO
      if (sessionStorage.getItem('logoImg')) {
        this.siteInfo.logo = sessionStorage.getItem('logoImg')
      }
    },
    methods: {
      getMenuList() {
        getMenu().then(response => {
          this.menuList = response.obj
          console.log(response.obj)
        }).catch(() => {
        })
      },
      /**
       * 20190822 固定首页
       * @param pa
       * @returns {*}
       */
      resolvePath(pa) {
        return path.resolve(this.baseUrl, pa)
      }

    },
    computed: {
      ...mapGetters([
        'isClosed'
      ])
    }
  }
</script>

<style scoped>
  ::-webkit-scrollbar { /*隐藏滚轮*/
    display: none;
  }

  .shadow {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  /**
   2019-11-06 将Logo区背景设置为白色
    */
  .logo {
    height: 85px;
    /*background: rgba(255, 128, 62, 1);*/
    background: rgba(255, 255, 255, 1);
    opacity: 1;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .logo img {
    width: 167px;
    height: auto;
  }
</style>
