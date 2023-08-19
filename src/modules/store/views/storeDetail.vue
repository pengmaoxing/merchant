<template>
  <div class="card_box">
    <!--第一行 卡片-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="name_title">{{operaDetail.name}}</span>
        <el-button style="float: right;font-size: 16px" type="text" @click="goBack"><i class="el-icon-back"></i> 返回列表
        </el-button>
      </div>
      <!--卡片内容-->
      <div>
        <table width="100%" class="info_table">
          <tbody>
          <tr>
            <td class="tb_title">门店编号</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.storeNo}}</td>  <!--内容-->
            <td class="tb_title">门店名称</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.name}}</td>  <!--内容-->
          </tr>
          <tr>
            <td class="tb_title">创建时间</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.name}}</td>  <!--内容-->
            <td class="tb_title">门店状态</td>   <!--标题-->
            <td class="tb_text">
              <template>
                <template v-if='operaDetail.status==1'>启用</template>
                <template v-else-if="operaDetail.status===2">注销</template>
              </template>
            </td>  <!--内容-->
          </tr>
          <tr>
            <td class="tb_title">店铺地址</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.province}} {{operaDetail.city}} {{operaDetail.address}}</td>  <!--内容-->
          </tr>
          </tbody>
        </table>
      </div>
    </el-card>

  </div>
</template>

<script>
  import {storeDetail} from '../api/store'
  import pagination from '@/components/pagination/index'

  export default {
    name: 'operaDetail',
    components: {pagination},
    data () {
      return {
        operaDetail: {}, //渠道商详情
      }
    },
    created () {

    },
    mounted () {
      console.log(this.$route.query.id)
      this.id = this.$route.query.id  //接收ID
      //获取本运营商详情
      this.storeDetail(this.id)

    },
    methods: {
      goBack: function () {
        this.$router.go('-1')
      },

      //获取运营商信息
      storeDetail: function (id) {

        //用vue router获取URL数据
        //然后用storeDetail获取这个运营商的数据
        storeDetail(id).then(res => {
          this.operaDetail = res.obj
        }).catch(e => {
          this.loading = false
        })
      },
    }
  }
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .card_box {
    padding: 0 20px;
  }

  .name_title {
    font-size: 32px;
  }

  .tb_title {
    font-weight: bold;
    width: 10%;
  }

  .tb_text {
    width: 20%;
    font-weight: lighter;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info_table tbody tr {
    height: 35px;
    font-size: 14px;
  }
</style>
