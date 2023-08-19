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
            <td class="tb_title">帐号</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.username}}</td>  <!--内容-->
            <td class="tb_title">手机号码</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.phone}}</td>  <!--内容-->
          </tr>
          <tr>
            <td class="tb_title">性别</td>   <!--标题-->
            <td class="tb_text">
              <template>
                <template v-if='operaDetail.sex==1'>男</template>
                <template v-else-if="operaDetail.sex===2">女</template>
              </template>
            </td>  <!--内容-->
            <td class="tb_title">所属门店</td>   <!--标题-->
            <td class="tb_text">{{operaDetail.storeName}}</td>  <!--内容-->
          </tr>
          <tr>
            <td class="tb_title">职位</td>   <!--标题-->
            <td class="tb_text">
              <template>
                <template v-if="operaDetail.userType==='1'">商户</template>
                <template v-else-if="operaDetail.userType==='2'">店长</template>
                <template v-else-if="operaDetail.userType==='3'">店员</template>
              </template>
            </td>  <!--内容-->
            <td class="tb_title">帐号状态</td>   <!--标题-->
            <td class="tb_text">
              <template>
                <template v-if='operaDetail.status==1'>启用</template>
                <template v-else-if="operaDetail.status===2">注销</template>
              </template>
            </td>  <!--内容-->
          </tr>
          </tbody>
        </table>
      </div>
    </el-card>

  </div>
</template>

<script>
  import {userDetail} from '../api/user'
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
      this.userDetail(this.id)

    },
    methods: {
      goBack: function () {
        this.$router.go('-1')
      },

      //获取运营商信息
      userDetail: function (id) {

        //用vue router获取URL数据
        //然后用userDetail获取这个运营商的数据
        userDetail(id).then(res => {
          this.operaDetail = res.obj
          console.log('1'+res)
          console.log('1'+res.obj.username)
          console.log('1'+res.obj.phone)
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
