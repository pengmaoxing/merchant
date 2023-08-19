<template>
  <div class="login-container" v-bind:style="bgStyle">

    <div class="header-bar">
      <div>
        <img v-if="siteInfo.logo" :src="siteInfo.logo" class="header-logo-left" alt="">
        <img v-else src="../../assets/images/login/noimg.png" class="header-logo-left" alt="">
      </div>
      <div class="service-info">
        <div><span>客服热线：{{info.servicePhone}}</span></div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover">
          <div style="text-align: center; margin: 0 auto">
            <img :src="getImg(info.wechatQrcode)" class="max-img" alt="">
          </div>
          <div slot="reference" class="wx-box"><img src="../../assets/images/login/weixin.png" class="wxlogo" alt=""><span>关注微信公众号</span>
          </div>
        </el-popover>
      </div>
    </div>


    <el-form class="login-form loginform">
      <!--<h3 class="title">脸付代理商登录</h3>-->
      <div class="header-logo">
        <!--<img v-if="siteInfo.logo" :src="siteInfo.logo" alt="">-->
        <!--<img  src="../../assets/images/login/logo.png" alt="">-->
        <span  class="nor-title">商户后台管理系统</span>
      </div>
      <div class="form-box">

        <h2 class="title">登录</h2>

        <el-form-item class="form-item-box">
          <p class="input-p">用户名：</p>
          <el-input v-model.trim="loginForm.username"></el-input>
        </el-form-item>

        <el-form-item>
          <p class="input-p">密&nbsp&nbsp&nbsp码：</p>
          <el-input v-model="loginForm.password" :type="pwdType"
                    @keyup.enter.native="handleLogin"></el-input>
          <!--<span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>-->
        </el-form-item>

        <div class="fogotBtn_box">
          <div>
            <el-button type="text" class="fogotBtn" @click="goFogotPw">&nbsp忘记密码</el-button>
          </div>
        </div>


        <el-form-item style="margin-top: 10px">
          <el-button type="primary" :loading="loading" @click="handleLogin" class="login-btn" style="">登录</el-button>
        </el-form-item>

      </div>
      <div class="null-box"></div>
    </el-form>

    <div class="copyright">
      <p v-show="info.techSupport">技术支持&nbsp{{info.techSupport||''}}</p>
      <p><span v-show="info.icpInfo">网站ICP备案号：{{info.icpInfo||''}}</span>
        <span v-show="info.copyrightInfo">Copyright&nbsp{{info.copyrightInfo||''}}</span></p>
    </div>
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
            this.bgStyle.backgroundSize = 100 + '%' //100%大小
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

<style rel="stylesheet/scss" lang="scss">
  $bg: #ffffff;
  $light_gray: rgba(204, 204, 204, 1);
  $text_gray: rgb(76, 76, 76);
  .loginform {
    .el-input {
      display: inline-block;
      height: 40px;
      width: 85%;

      input {
        background: transparent;
        border: 1px solid $light_gray;
        width: 300px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $text_gray;
        height: 40px;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $text_gray !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      /*background: rgba(0, 0, 0, 0.1);*/
      border-radius: 5px;
      color: #454545;
    }
  }


</style>

<style rel="stylesheet/scss" lang="scss" scoped>

  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .fogotBtn_box {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: -20px;

  }

  .login-btn {
    width: 100%;
    border: 0;
    background: rgba(255, 128, 62, 1);
  }


  .login-container {
    /*position: fixed;*/
    height: 100%;
    width: 100%;
    background: url("../../assets/images/login/bg.png") no-repeat center top;
    background-size: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .header-logo {
      text-align: center;
    }
    .header-bar {
      height: 75px;
      width: 90%;
      border-bottom: 1px solid #efefef;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      font-size: 14px;
      color: white;
    }

    .service-info {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .service-info > div {
      margin: 0 10px;
    }

    .wxlogo {
      width: 23px;
      height: 20px;
    }

    .header-logo {
      text-align: center;
    }

    .header-logo-left {
      height: 50px;
      width: auto;
    }

    .service-info span {
      line-height: 23px;
    }

    .wx-box {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .wxlogo{
      margin-right: 5px;
    }


    .copyright {
      font-size: 14px;
      color: #bababa;
      text-align: center;
    }

    .header-logo img {
      width: 260px;
      height: auto;
    }

    .form-box {
      margin-top: 50px;
      width: 380px;
      height: 365px;
      padding: 25px 40px 25px 40px;
      background-color: white;
    }

    .null-box {
      width: 380px;
      height: 110px;
      background-color: rgba(255, 128, 62, 0);
    }

    /*.login-form {*/
    /*position: absolute;*/
    /*left: 0;*/
    /*right: 0;*/
    /*!*width: 520px;*!*/
    /*padding: 35px 35px 15px 35px;*/
    /*margin: 120px auto;*/
    /*}*/


    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;

      &_login {
        font-size: 20px;
      }
    }

    .title {
      font-size: 20px;
      font-weight: bold;
      line-height: 25px;
      color: rgba(255, 128, 62, 1);
      opacity: 1;
      margin: 0;
      padding: 0;
    }

    .form-item-box {
      margin-top: 30px;
    }

    .input-p {
      margin: 0;
      padding: 0;
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
      color: rgba(112, 112, 112, 1);
      opacity: 1;
      margin-bottom: 3px;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }

  @media (max-width: 1024px) {
    .null-box {
      display: none;
    }
  }

  .nor-title {
    font-size: 24px;
    line-height: 26px;
    color: white;
    font-weight: bold;
  }

  .max-img{
    width: 170px;
    height: auto;
  }
</style>
