<template>
  <div class="app-container">
    <!--创建卡券-->
    <createcoupon openmode="1" :couponid="bindCardCouponId">

    </createcoupon>
  </div>
</template>

<script>
  import createcoupon from '@/components/createCoupon/index' //引入卡券组件

  export default {
    name: 'createCoupon',
    components: {createcoupon}, //创建卡券组件
    data() {
      return {
        bindCardCouponId: ''
      }
    },
    created() {
      this.bindCardCouponId = this.$route.query.id == undefined ? '' : this.$route.query.id //接收ID
    },

    mounted() {

    }
  }
</script>

<style scoped>

</style>
