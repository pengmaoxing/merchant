<template>
  <div class="login-container login-special" :style="bgStyle">
    <!--头部-->
    <el-header height="80px">
      <!--Logo和信息-->
      <div class="info-container">
        <!--左侧logo-->
        <div class="info-logo">
          <img v-if="siteInfo.logo" :src="siteInfo.logo" class="header-logo-left" alt="">
          <img v-else src="../../assets/images/login/noimg.png" class="header-logo-left" alt="">
        </div>
        <!--右侧 客服和微信二维码-->
        <div class="info-service">
          <div class="info-service-line"><span>客服热线：{{info.servicePhone}}</span></div>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover">
            <div style="text-align: center; margin: 0 auto">
              <img :src="getImg(info.wechatQrcode)" class="max-img" alt="">
            </div>
            <div slot="reference" class="info-service-wechat">
              <img src="../../assets/images/login/weixin.png" class="wxlogo" alt="">
              <span class="wxlogo-tips">关注微信公众号</span>
            </div>

          </el-popover>

        </div>
      </div>
    </el-header>

    <!--登录区-->
    <el-main class="main">
      <!--登录框-->
      <div class="login-widnow-box flex-c-c-c">
        <h1 class="login-window-title">商户后台管理系统</h1>
        <div class="login-window-form flex-c-c-c">

          <div class="login-window-decorateline flex-c-c-c">
            <span>用户登录</span>
          </div>

          <div class="login-window-input-form flex-c-c-c">

            <!--用户名-->
            <div class="login-window-input userinput flex-r-c-c">
              <div class="username-icon input-icon">
                <img src="../../assets/images/login/new/联系人.png" alt="">
              </div>
              <el-input class="input-item" v-model.trim="loginForm.username"></el-input>
            </div>
            <!--密码-->
            <div class="login-window-input passwordinput flex-r-c-c">
              <div class="password-icon input-icon">
                <img src="../../assets/images/login/new/密码.png" alt="">
              </div>
              <el-input type="password" class="input-item" @keyup.enter.native="handleLogin"
                        v-model.trim="loginForm.password"></el-input>
            </div>

            <div class="fogotPW-btn-box">
              <span @click="goFogotPw">忘记密码？</span>
            </div>

            <div class="login-btn-box flex-c-c-c" @click="handleLogin">
              <span >{{loading?'登录中...':'登录'}}</span>
            </div>

          </div>


        </div>

      </div>
    </el-main>

    <!--页脚-->
    <el-footer height="80px" class="footer">

      <div class="copyright">
        <p v-show="info.techSupport">技术支持&nbsp{{info.techSupport||''}}</p>
        <p><span v-show="info.icpInfo">网站ICP备案号：{{info.icpInfo||''}}</span>
          <span v-show="info.copyrightInfo">Copyright&nbsp{{info.copyrightInfo||''}}</span></p>
      </div>


    </el-footer>

  </div>
</template>

<script>
  import {getSiteInfo} from '@/modules/login/api/login'
  import {returnThumbnailUrl, returnFilesUrl, uploadUrl} from '@/modules/file/api/upload' //图片操作API


  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        siteInfo: {
          bg: '',
          logo: '',
        },
        bgStyle: {
          background: '',
          backgroundSize: '',
        },
        loading: false,
        pwdType: 'password',
        info: {}
      }
    },
    mounted() {
      //获取默认信息
      this.getInfo()
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },


      handleLogin() {
        this.loading = true
        this.$store.dispatch('login', this.loginForm).then(() => {
          this.$router.replace({path: '/'})
        }).catch(() => {
          this.loading = false
        })
      },


      /**
       * 获取信息
       */
      getInfo: function () {
        getSiteInfo().then(res => {
          console.log(res);
          let data = res.obj;
          //如果有背景图
          if (data.mctBgmPhoto !== '' && data.mctBgmPhoto != null) {
            this.siteInfo.bg = "url('" + this.getImg(data.mctBgmPhoto) + "') no-repeat";
            this.bgStyle.background = this.siteInfo.bg; //背景图片
            // this.bgStyle.backgroundSize = 100 + '%' //100%大小
          }
          //如果有LOGO
          if (data.logo !== '' && data.logo != null) {
            this.siteInfo.logo = this.getImg(data.logo);
            sessionStorage.removeItem('logoImg')
            sessionStorage.setItem('logoImg', this.getImg(data.logo))
          }
          this.info = data
          document.title = this.info.name+'-'+'商户平台'||'商户平台'

        })
      },

      /**
       * 换取图片
       */
      getImg: function (val) {
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          return returnFilesUrl(val)
        } else {
          let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC';
          return base64
        }
      },

      /**
       * 忘记密码
       */
      goFogotPw() {
        console.log('go')
        this.$router.push({path: '/fogot'})
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;


  .flex-c-c-c {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .flex-r-c-c {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .login-container {
    height: 100%;
    width: 100%;

    color: white;

    /*默认背景*/
    background: url("../../assets/images/login/new/背景2.png") no-repeat center center;
    background-size: 100% 100%;

    /*Logo和信息*/
    .info-container {
      padding: 20px 30px;
      height: 120px;

      font-size: 14px;
      color: white;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      /*logo*/
      .info-logo {
        height: 80px;

        .header-logo-left {
          height: 80px;
          width: auto;
        }
      }

      /*联系和微信*/
      .info-service {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        cursor: default;


        .info-service-line {

        }


        .info-service-wechat {
          margin-left: 20px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;


          .wxlogo {
            width: 23px;
            height: 20px;
          }

          .wxlogo-tips {
            margin-left: 5px;
          }
        }


      }

    }


    //中间 登录区

    .main {
      height: calc(100% - 120px);
      padding: 0 252px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

    }

    @media (max-width: 1024px) {
      .main {
        padding: unset;
        align-items: center;
      }
    }


    .login-widnow-box {


      /*登录标题*/
      .login-window-title {
        font-size: 36px;
        margin: 10px 0;
        line-height: 40px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }


      /*登录表单*/
      .login-window-form {
        margin: 20px 0 40px 0;
        width: 593px;
        height: 383px;

        background: url("../../assets/images/login/new/背景框.png");

        @media (max-width: 594px) {
          width: unset;
          background: unset;
        }

        @media (max-height: 600px) {
          height: unset;
          background: unset;
        }

        /*登录表单 内 横线装饰*/
        .login-window-decorateline {
          width: 380px;
          height: 10px;

          background: url("../../assets/images/login/new/登录装饰.png");

          span {
            font-size: 16px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 16px;
          }
        }

        /*登录表单 内 表单*/
        .login-window-input-form {
          margin-top: 35px;

          .login-window-input {
            width: 387px;
            height: 50px;

            background: url("../../assets/images/login/new/输入框.png");
          }

          .input-item {
            position: relative;
            left: 36px;

            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgb(198, 198, 198) !important;
            line-height: 16px;
          }

          .passwordinput {
            margin-top: 27px;
          }


          .input-icon {
            position: relative;
            top: 4px;
            left: 30px;
          }

          .username-icon {
            img {
              width: 21px;
              height: 26px;
            }
          }

          .password-icon {
            img {
              width: 21px;
              height: 26px;
            }
          }

          /*忘记密码*/
          .fogotPW-btn-box {
            width: 387px;
            height: 50px;
            text-align: right;

            cursor: default;

            span {
              cursor: pointer;

              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              line-height: 50px;
            }
          }

          /*登录按钮*/
          .login-btn-box {
            cursor: pointer;

            width: 274px;
            height: 42px;

            background: url("../../assets/images/login/new/登录按钮.png");

            span {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
            }
          }
        }

      }
    }


    /*页脚*/
    .footer {
      position: fixed;
      width: 100%;
      bottom: 0;
      margin: 0 auto;


      .copyright {
        font-size: 14px;
        color: #828282;
        text-align: center;
      }
    }


  }

  .max-img{
    width: 170px;
    height: auto;
  }


</style>

