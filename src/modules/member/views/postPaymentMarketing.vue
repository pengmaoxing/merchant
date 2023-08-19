<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>规则配置</span>
      </div>
      <div>
        <!--设置项-->
        <el-form :model="marketingForm" ref="marketingForm" label-width="120px" size="medium">
          <el-form-item label="规则时间：">
            <div v-if="!editMode">
              <span>2019-01-01 12:00:00至2019-12-31 12:00:00</span>
            </div>
            <div v-if="editMode">
              <el-form-item class="block" prop="startTime">
                <el-date-picker
                  v-model="marketingForm.startTime"
                  type="datetime"
                  placeholder="选择开始日期时间"
                  value-format="timestamp">
                </el-date-picker>
              </el-form-item>
              至
              <el-form-item class="block" prop="endTime">
                <el-date-picker
                  v-model="marketingForm.endTime"
                  type="datetime"
                  placeholder="选择开始日期时间"
                  value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </div>


          </el-form-item>
          <el-form-item label="消费条件：">
            <div v-if="!editMode">
              <span>不限金额/满XX元可用</span>
            </div>
            <div v-if="editMode">
              <div class="block">
                <el-form-item prop="conditions">
                  <el-radio v-model="marketingForm.conditions" label="1">不限金额</el-radio>
                  <el-radio v-model="marketingForm.conditions" label="2">指定金额</el-radio>
                </el-form-item>
              </div>
              <div class="block">
                <el-form-item prop="money">
                  <el-input class="block" placeholder="请输入金额（元）" :disabled="marketingForm.conditions==1"
                            v-model="marketingForm.money"></el-input>
                </el-form-item>
              </div>
              <div class="block">
                <span>元以上即可</span>
              </div>
            </div>


          </el-form-item>
          <el-form-item label="领卡渠道：" prop="cardingChannel">
            <div v-if="!editMode">
              <el-radio v-model="marketingInfo.cardingChannel" label="1">支付后推送 （仅限C扫B支付，支付成功页展示领会员卡入口）</el-radio>
            </div>
            <div v-if="editMode">
              <el-form-item prop="cardingChannel">
                <el-radio v-model="marketingForm.cardingChannel" label="1">支付后推送 （仅限C扫B支付，支付成功页展示领会员卡入口）</el-radio>
              </el-form-item>
            </div>

          </el-form-item>

        </el-form>

        <div class="btn-box">
          <el-button v-if="editMode==false" type="primary" size="medium" @click="openEditMode">修 改</el-button>
          <el-button v-if="editMode" type="primary" size="medium" @click="submitForm">保 存</el-button>
          <el-button v-if="editMode" size="medium" @click="CloseEditMode">取 消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'postPaymentMarketing',
    data () {
      return {
        loading: false,// 页面加载圈
        marketingInfo: {
          startTime: '2019-01-01 12:00:00',
          endTime: '2019-12-31 12:00:00',
          conditions: '不限',
          cardingChannel: '1',
        },//显示信息
        marketingForm: {
          startTime: '', //开始时间
          endTime: '', //结束数据
          conditions: '1', //消费条件 1无限 2有门槛
          money: '', //有门槛的话是多少钱
          cardingChannel: '1',//领卡渠道
        },//表单
        editMode: false  //f显示模式  t编辑模式
      }
    },
    methods: {
      /**
       * 打开编辑模式
       */
      openEditMode: function () {
        this.editMode = true
      },
      /**
       * 关闭编辑模式
       */
      CloseEditMode: function () {
        this.$refs['marketingForm'].resetFields()
        this.editMode = false
      },
      /**
       * 提交表单
       */
      submitForm: function () {
        console.log(this.marketingForm)
      },
    }
  }
</script>

<style scoped>
  .btn-box {
    text-align: center;
  }

  .block {
    display: inline-block;
    vertical-align: middle;
  }

</style>
