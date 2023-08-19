<template>
  <div class="login-container">

    <el-card class="box-card">
      <!--步骤图-->
      <div class="card_inside">

        <el-steps :active="active" align-center>
          <el-step title="输入用户名" description="请输入需要重置密码的用户名"></el-step>
          <el-step title="获取验证码" description="获取并输入短信中的验证码"></el-step>
          <el-step title="设置新密码" description="请务必牢记您的新密码"></el-step>
          <el-step title="设置完成" description="点击“登录”前往登录页"></el-step>
        </el-steps>
      </div>

      <div>
        <!--输入用户名-->
        <div v-if="active==0">
          <el-form :model="accountForm" :rules="accountRules" ref="accountForm" label-width="100px" class="card_form">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="accountForm.userName" placeholder="请输入您需要重置密码的用户名"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!--查询到手机，输入验证码-->
        <div v-if="active==1">
          <el-form :model="msgCodeForm" :rules="msgCodeRules" ref="msgCodeForm" label-width="100px" class="card_form">
            <el-form-item label="手机号">
              <el-input v-model="abbrPhone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input v-model="msgCodeForm.code" placeholder="请输入收到的短信验证码">
                <el-button slot="append" :disabled="!msgBtn" @click="sendMsg">{{sendText}}</el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <!--设置新密码-->
        <div v-if="active==2">
          <el-form :model="newPasswordForm" :rules="newPasswordRules" ref="newPasswordForm" label-width="100px"
                   class="card_form">
            <el-form-item label="新密码" prop="password">
              <el-input type="password" v-model="newPasswordForm.password" placeholder="输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input type="password" v-model="newPasswordForm.checkPassword" placeholder="再次输入密码">
              </el-input>
            </el-form-item>
          </el-form>
        </div>

        <div v-if="active==3">
          <h3 style="text-align: center;margin: 30px">新密码设置成功，务必牢记</h3>
        </div>


      </div>

      <div class="card_btn_vbox">
        <el-button style="margin:12px auto;" @click="next">{{activeName}}</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
  import {phoneFindByUsername, sendSms, verifyCode, resetNewPwd} from '@/modules/fogot/fogot'

  export default {
    name: 'fogot',
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.newPasswordForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        active: 0,  //步骤条
        activeName: '下一步',
        accountForm: {
          userName: ''
        }, //用户名表单
        phone: '',//预览用手机号
        abbrPhone: '',//*号手机号
        msgCodeForm: {
          code: ''
        },//短信验证码表单
        newPasswordForm: {
          password: '',
          checkPassword: ''
        },
        newPasswordRules: {
          password: [
            {required: true, message: '不能为空', trigger: 'blur'},
          ],
          checkPassword: [
            {validator: validatePass, trigger: 'blur'},
          ]
        },//用户名规则
        accountRules: {
          userName: [
            {required: true, message: '必须输入您的用户名', trigger: 'blur'},
          ]
        },//用户名规则
        msgCodeRules: {
          code: [
            {required: true, message: '请输入收到的短信验证码', trigger: 'blur'},
            {min: 6, max: 6, message: '验证码位数出错，长度为6位。', trigger: 'blur'}
          ]
        },//短信验证码规则
        msgBtn: true,
        second: 30,
        sendText: '发送验证码'
      }
    },
    methods: {
      next () {
        if (this.active == 0) {
          /**
           * 表单验证
           */
          this.$refs['accountForm'].validate((valid) => {
            if (valid) {
              phoneFindByUsername(this.accountForm.userName).then(response => {
                this.phone = response.obj
                this.abbrPhone = this.formatPhone(response.obj)
                this.active++
              }).catch(() => {
              })
            } else {
              this.$message.error('您还没输入用户名')
              return true
            }
          })
          //直接下一页
          // this.active++
        } else if (this.active == 1) {
          this.$refs['msgCodeForm'].validate((valid) => {
            if (valid) {
              console.log(this.phone)
              verifyCode(this.phone, this.msgCodeForm.code).then(response => {
                this.active++
              }).catch(() => {
              })
            } else {
              this.$message.error('您还没输入验证码')
              return false
            }
          })
          // this.active++
        } else if (this.active == 2) {
          this.$refs['newPasswordForm'].validate((valid) => {
            if (valid) {
              resetNewPwd(this.accountForm.userName, this.newPasswordForm.password).then(response => {
                this.active++
              }).catch(() => {
              })
            } else {
              this.$message.error('密码设置不符合规则')
              return false
            }
          })
          // this.active++
          this.activeName = '前往登录'
        } else if (this.active == 3) {
          console.log('go')
          this.$router.push({path: '/login'})
        }

        //if (this.active++ > 2) this.active = 0

      },
      //格式化手机号
      formatPhone: function (str) {
        let arr = str.split('')
        for (let i in arr) {
          if (i > 2 && i < 7) {
            arr[i] = '*'
          }
        }
        let fomatStr = arr.join('')
        console.log(fomatStr)
        return fomatStr
      },

      sendMsg: function () {
        sendSms(this.phone).then(response => {
          // this.phone=response.obj
        }).catch(() => {
        })
        if (!this.msgBtn) return  //判断是否还能再点
        this.$message.success('发送短信至' + this.abbrPhone)
        this.msgBtn = false
        //发起网络请求

        //发起网络请求
        this.sendText = this.second + 's后重新发送'
        let clock = window.setInterval(() => {
          this.second--
          this.sendText = this.second + 's后重新发送'
          if (this.second < 0) {
            window.clearInterval(clock)
            this.sendText = '重新发送验证码'
            this.second = 10
            this.msgBtn = true //开启按钮
          }
        }, 1000)
      },

      /**
       * 返回登录
       */
      goindex () {
        console.log('go')
        this.$router.push({path: '/login'})
      }
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>

  $bg: #2d3a4b;
  $light_gray: #343434;
  .login-container .el-input input {
    color: $light_gray;
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;


  /* reset element-ui css */
  .login-container {
    width: 100%;
    height: 100%;
    max-width: 100%;
    display: flex;
    background-color: $bg;
    flex-direction: row;
    justify-content: center;
    align-items: center;


    .box-card {
      width: 1300px;
      max-width: 100%;
      padding: 20px;

      .card_form {
        margin: 30px auto;
        width: 600px;
      }

      .card_btn_vbox {
        text-align: center;
      }
    }
  }
</style>
