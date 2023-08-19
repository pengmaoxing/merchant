<template>
  <div class="app-container" v-loading="loading">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 32px;font-size: 24px;color: #3e526f">订单详细</span>
        <div style="float: right">
          <el-button type="" size="small" @click="refresh">刷 新</el-button>
          <el-button type="" size="small" @click="refundDialogOpen">退 款
          </el-button>
          <el-button type="primary" size="small" @click="goBack">返 回</el-button>
        </div>
      </div>

      <div>
        <!--订单详细-->
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span style="line-height: 32px">订单详细</span>
          </div>
          <div>
            <table class="dataTable">

              <tr>
                <td class="td_title">订单编号</td>
                <td class="td_text">{{orderDetail.orderNumber}}</td>
              </tr>

              <tr>
                <td class="td_title">订单金额</td>
                <td class="td_text">{{orderDetail.totalPrice}}</td>
              </tr>

              <tr>
                <td class="td_title">门店名称</td>
                <td class="td_text">{{orderDetail.storeName}}</td>
              </tr>

              <tr>
                <td class="td_title">收银员</td>
                <td class="td_text">{{orderDetail.username}}</td>
              </tr>

              <tr>
                <td class="td_title">订单状态</td>
                <td class="td_text">{{payStatus(orderDetail.status)}}</td>
              </tr>

              <tr>
                <td class="td_title">支付方式</td>
                <td class="td_text">{{payWay(orderDetail.payWay)}}</td>
              </tr>

              <tr>
                <td class="td_title">会员手机号</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">本次积分</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">创建时间</td>
                <td class="td_text">{{orderDetail.createTime||'--'}}</td>
              </tr>

              <tr>
                <td class="td_title">支付时间</td>
                <td class="td_text">{{orderDetail.payTime||'--'}}</td>
              </tr>

              <tr>
                <td class="td_title">退款金额</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">退款积分</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">基本描述</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">描述详细</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">订单备注</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">顾客实付</td>
                <td class="td_text">{{orderDetail.actPayPrice}}</td>
              </tr>

              <tr>
                <td class="td_title">优惠</td>
                <td class="td_text">{{orderDetail.disCountPrice}}</td>
              </tr>
            </table>
          </div>
        </el-card>
        <!--支付详细-->
        <!--暂时不用 -->
        <!--
        <el-card class="box-card" style="margin-top: 20px" shadow="never">
          <div slot="header" class="clearfix">
            <span style="line-height: 32px">支付宝订单信息</span>
          </div>
          <div>
            <table class="dataTable">

              <tr>
                <td class="td_title">支付宝订单号</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">买家支付宝账号</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">交易金额</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">实收金额</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">买家付款金额</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">集分宝付款金额</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">商户门店名称</td>
                <td class="td_text">*</td>
              </tr>

              <tr>
                <td class="td_title">用户开具发票的金额</td>
                <td class="td_text">*</td>
              </tr>
            </table>
          </div>
        </el-card>
          -->
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
    <el-button @click="refundDialogClose">取 消</el-button>
    <el-button type="primary" @click="submitRefund">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {findOrderDetail, refund} from '../api/flowOrderDetail'
  import {
    findOrderStatusOption,
    findOrderPayWayOption,
  } from '../api/public'

  export default {
    name: 'flowOrderDetail',
    data() {
      //金额校验
      var validateActualPrice = (rule, value, callback) => {
        let reg = /^\d+(\.\d{0,2})?$/;
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
      };
      return {
        loading: false,
        refundDialogVisible: false,// 退款模态框
        userType: 2,
        refundForm: {
          id: '',
          allowPrice: 0,
          actualPrice: '',
          refundPw: ''
        },//退款表单
        orderDetail: {},
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
        },
        payWayOption: [],//支付方式选项
        statusOption: [],//订单状态选项
        urlId: '',
      }
    },
    mounted() {
      this.getStatusOption(); //获取支付状态
      this.getPayWayOption(); //获取支付方式
      //获取登录用户类型
      this.userType = sessionStorage.getItem('userType');
      //获取URL参数
      this.urlId = this.$route.query.id == undefined ? '' : this.$route.query.id; //接收ID
      if (this.urlId != '') {
        this.getDetail(this.urlId)
      }

    },
    computed: {
      //支付方式
      payWay: function (val) {
        return function (val) {
          let str = '未知';
          let pt = this.payWayOption;
          for (let i in pt) {
            if (pt[i].value == val) {
              str = pt[i].name;//赋值匹配名字
              break//停止循环
            }
          }
          return str
        }
      },
      //支付状态
      payStatus: function (val) {
        return function (val) {
          let str = '未知';
          let pt = this.statusOption;
          for (let i in pt) {
            if (pt[i].value == val) {
              str = pt[i].name;//赋值匹配名字
              break//停止循环
            }
          }
          return str
        }
      }

    },
    methods: {
      //获取信息
      getDetail: function (id) {
        findOrderDetail(id).then(res => {
          console.log(res);
          this.orderDetail = res.obj;
          this.loading = false
        }).catch(e => {
          this.$message.error('获取订单详情错误')
        })
      },

      /**
       * 获取支付状态
       */
      getStatusOption: function () {
        findOrderStatusOption().then(res => {
          // console.log(res)
          this.statusOption = res.obj
        }).catch(e => {
          this.$message.error('支付状态选项无法获取')
        })
      },
      /**
       * 获取支付方式
       */
      getPayWayOption: function () {
        findOrderPayWayOption().then(res => {
          // console.log(res)
          this.payWayOption = res.obj
        }).catch(e => {
          this.$message.error('支付方式选项无法获取')
        })
      },

      /**
       * 打开退款模态框
       */
      refundDialogOpen: function () {
        // 打开前先判断是否有效
        let status = this.orderDetail.status;
        if (status == '' || status == undefined || status == null) {
          this.$message.error('未获取到订单信息，无法退款')
        } else if (status == '1') {
          this.$message('订单还未支付，无法退款')
        } else if (status == '3') {
          this.$message('订单支付失败，无法退款')
        } else {
          //允许退款时，金额赋值
          this.refundForm.allowPrice = this.orderDetail.remainPrice;
          this.refundForm.id = this.orderDetail.orderNumber;
          this.refundDialogVisible = true

        }
      },
      /**
       * 关闭退款模态框
       */
      refundDialogClose: function () {
        this.$refs['refundForm'].resetFields(); //清空表单
        this.refundDialogVisible = false
      },
      /**
       * 全退
       */
      allRefund: function () {
        let x = this.refundForm.allowPrice;
        if (x != '' || x != null || x != undefined) {
          this.refundForm.actualPrice = x
        }
      },
      /**
       * 提交退款
       */
      submitRefund: function () {
        this.$refs['refundForm'].validate((valid) => {
          if (valid) {

            let data = this.refundForm;

            refund(data).then(res => {
              this.$message.success('退款成功');
              this.refundDialogClose();
            }).catch(e => {
            })

          } else {
            console.log('表单错误');
            return false
          }
        });
        console.log(this.refundForm)
      },

      //返回
      goBack: function () {
        this.$router.go('-1')
      },

      //刷新
      refresh: function () {
        this.loading = true;
        this.getStatusOption(); //获取支付状态
        this.getPayWayOption(); //获取支付方式
        this.getDetail(this.urlId);
        this.$message.success('刷新成功')
      },

    }
  }
</script>

<style scoped>
  .dataTable tr {
    font-size: 14px;
    color: #3A3A3A;
    height: 40px;
  }

  .td_title {
    width: 150px;
    font-weight: bold;
  }

  .td_title:after {
    content: '：';
  }
</style>
