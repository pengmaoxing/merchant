<template>
  <div class="app-container" v-loading="loading">

    <!--订单信息-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单详细</span>
        <el-button style="float: right;padding: 0" type="text" @click="goback">返回上一页</el-button>
      </div>

      <div>
        <!--订单标题与状态-->
        <div class="order_header">
          <!--订单号与支付状态-->
          <div class="order_num_border">
            <div><img class="order_number_img" src="../../../assets/images/pay/icon/订单编号.png" alt="">
            </div>
            <div><span class="order_number">订单编号：</span></div>
          </div>

          <div class="payStatus">
            <div class="payStatus_icon success">
              <span>支付成功</span>
            </div>
          </div>
          <!--操作-->
          <div class="order_tools">
            <el-button size="small" @click="onload">刷新</el-button>
            <el-button size="small" @click="refundDialogOpen">退款</el-button>
          </div>
        </div>
        <!--订单信息-->
        <div>
          <table class="order_info_table">
            <tr>
              <td>订单创建时间</td>
              <td>2019-05-08 16:38:14</td>
              <td>订单支付时间</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>门店名称</td>
              <td>2019-05-08 16:38:14</td>
              <td>收营员</td>
              <td>2019-05-08 16:38:14</td>
              <td>二维码名称</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>订单金额</td>
              <td>2019-05-08 16:38:14</td>
              <td>商户优惠金额</td>
              <td>2019-05-08 16:38:14</td>
              <td>其他优惠金额</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>顾客实付</td>
              <td>2019-05-08 16:38:14</td>
              <td>退款金额</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>支付终端</td>
              <td>2019-05-08 16:38:14</td>
              <td>支付通道</td>
              <td>2019-05-08 16:38:14</td>
              <td>支付方式</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>基本描述</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>描述详细</td>
              <td>2019-05-08 16:38:14</td>
            <tr>
              <td>订单备注</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
          </table>
        </div>

      </div>

      <div style="margin-top: 20px">
        <!--支付方式及支付订单信息-->
        <div class="order_header">
          <!--订单号与支付状态-->
          <div class="order_num_border">
            <div><img class="order_number_img" src="../../../assets/images/pay/icon/wx.png" alt="">
              <!--<div><img class="order_number_img" src="../../../assets/images/pay/icon/zfb.png" alt="">-->
            </div>
            <div>
              <span class="order_number">支付宝订单信息</span>
              <!--<span class="order_number">微信订单信息</span>-->
            </div>
          </div>

        </div>
        <!--支付订单信息-->
        <!--<div>-->
        <!--<table class="order_info_table">-->
        <!--<tr>-->
        <!--<td>微信订单号</td>-->
        <!--<td>2019-05-08 16:38:14</td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>现金支付金额</td>-->
        <!--<td>2019-05-08 16:38:14</td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>用户标识</td>-->
        <!--<td>2019-05-08 16:38:14</td>-->
        <!--<td>付款银行</td>-->
        <!--<td>2019-05-08 16:38:14</td>-->
        <!--<td>付款银行</td>-->
        <!--<td>2019-05-08 16:38:14</td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>支付方式</td>-->
        <!--<td>2019-05-08 16:38:14</td>-->
        <!--<td>货币类型</td>-->
        <!--<td>2019-05-08 16:38:14</td>-->
        <!--<td>优惠券或立减优惠</td>-->
        <!--<td>2019-05-08 16:38:14</td>-->
        <!--</tr>-->
        <!--</table>-->
        <!--</div>-->

        <div>
          <table class="order_info_table">
            <tr>
              <td>支付宝订单号</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>买家支付宝账号</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>交易金额</td>
              <td>2019-05-08 16:38:14</td>
              <td>实收金额</td>
              <td>2019-05-08 16:38:14</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>买家付款金额</td>
              <td>2019-05-08 16:38:14</td>
              <td>集分宝金额</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>商户门店名称</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
            <tr>
              <td>用户开具发票</td>
              <td>2019-05-08 16:38:14</td>
            </tr>
          </table>
        </div>

      </div>


    </el-card>

    <!--模态框-->
    <el-dialog
      title="退款"
      :visible.sync="refundDialogVisible"
      width="576px"
      :before-close="refundDialogClose">
      <div>

        <el-form :model="refundForm" :rules="refundRules" ref="refundForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="退款ID" prop="id">
            <el-input v-model="refundForm.id" readonly="readonly" disabled></el-input>
          </el-form-item>
          <el-form-item label="可退金额" prop="allowPrice">
            <el-input v-model="refundForm.allowPrice" readonly="readonly" disabled>
              <el-button slot="append" @click="allRefund">全退</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="退款金额" prop="actualPrice">
            <el-input v-model="refundForm.actualPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="退款密码" prop="refundPw">
            <el-input type="password" v-model="refundForm.refundPw" autocomplete="new-password"></el-input>
          </el-form-item>
        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="refundDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitRefund">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'flowPreOrderDetail',
    data () {
      //金额校验
      var validateActualPrice = (rule, value, callback) => {
        let reg = /^\d+(\.\d{0,2})?$/
        if (!reg.test(value)) {
          callback(new Error('金额格式错误'))
        } else {
          if (value <= 0) {
            callback(new Error('退款金额无意义'))
          } else if (value > this.refundForm.allowPrice) {
            callback(new Error('超过订单金额'))
          } else {
            callback()
          }
        }
      }
      return {
        loading: false,//等待加载
        refundDialogVisible: false,// 退款模态框
        refundForm: {
          id: '123',
          allowPrice: 10,
          actualPrice: '',
          refundPw: ''
        },//退款表单
        refundRules: {
          id: [
            {required: true, message: '未获取到订单ID，无法进行退款', trigger: 'blur'},
          ],
          allowPrice: [
            {required: true, message: '未获取到订单实付金额，无法进行退款', trigger: 'blur'},
          ],
          actualPrice: [
            {required: true, message: '请输入需要退款的金额', trigger: 'blur'},
            {validator: validateActualPrice, trigger: 'blur'}
          ],
          refundPw: [
            {required: true, message: '必须输入退款操作密码', trigger: 'blur'},
          ]
        }
      }
    },
    mounted () {
    },
    methods: {
      /**
       * 打开退款模态框
       */
      refundDialogOpen: function () {
        this.refundDialogVisible = true
      },
      /**
       * 关闭退款模态框
       */
      refundDialogClose: function () {
        this.refundDialogVisible = false
      },
      /**
       * 全退
       */
      allRefund: function () {
        let x = this.refundForm.allowPrice
        if (x != '' || x != null || x != undefined) {
          this.refundForm.actualPrice = x
        }
      },
      /**
       * 提交退款
       */
      submitRefund: function () {

        console.log(this.refundForm)
      },

      //*********tools
      onload: function () {

      },
      /**
       * 返回
       */
      goback: function () {
        this.$router.go('-1')
      },
    }
  }
</script>

<style scoped>
  .order_header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .order_num_border {
    padding: 0;
    width: 301px;
    height: 34px;
    border: 1px solid #bfbfbf;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .order_num_border > div {
    height: 34px;
  }

  .order_number_img {
    width: 34px;
    height: 34px;
  }

  .order_number {
    padding: 0 0 0 5px;
    line-height: 34px;
    font-size: 13px;
  }

  .payStatus {
    margin-left: 20px;
  }

  .payStatus_icon {
    height: 34px;
    width: 84px;
    border-radius: 5em 0em / 5em 3em;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .success {
    background-image: linear-gradient(to top right, #ffce3e, #ffad15);
  }

  .error {
    background-image: linear-gradient(to top right, #ff6150, #ff374b);
  }

  .payStatus_icon span {
    font-size: 14px;
    color: white;
  }

  .order_tools {
    margin-left: auto;
    align-self: center;
  }

  /*信息*/
  .order_info_table {
    width: 100%;
    margin-top: 20px;
    font-size: 15px;
  }

  .order_info_table tr {
    height: 30px;
  }

  .order_info_table tr td:nth-child(odd) {
    width: 10%;
    line-height: 30px;
    text-align: right;
    font-weight: bold;
  }

  .order_info_table tr td:nth-child(odd):after {
    content: '：';
  }

  .order_info_table tr td:nth-child(even) {
    width: 23%;
    line-height: 30px;
  }
</style>
