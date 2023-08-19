<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleBar" :isActive="isClosed"></hamburger>
    <breadcrumb></breadcrumb>
    <div class="avatar-container username">{{username}}</div>
    <div class="avatar-container messageicon">
      <img src="../../../assets/images/nav/mes.png" alt="">
    </div>
    <el-dropdown class="avatar-container" trigger="click">

            <span class="el-dropdown-link">
                个人中心<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item @click.native="changeUserInfoDialogOpen">修改信息</el-dropdown-item>
        <el-dropdown-item @click.native="resetPasswordDialogOpen">修改密码</el-dropdown-item>
        <el-dropdown-item @click.native="detailDialogOpen">商户详情</el-dropdown-item>
        <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
      </el-dropdown-menu>

    </el-dropdown>
    <div class="avatar-container powerIcon" @click="logout">
      <i class="el-icon-switch-button"></i>
    </div>
    <el-dialog
      title="重置密码"
      :visible.sync="resetPasswordDialog"
      width="576px"
      :before-close="resetPasswordDialogClose">
      <el-form :model="resetForm" ref="resetForm" label-width="100px">
        <el-form-item label="原密码" prop="password">
          <el-input v-model="resetForm.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="resetForm.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input v-model="resetForm.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="resetPasswordDialogClose">取 消</el-button>
    <el-button type="primary" @click="saveNewPssword">提 交</el-button>
  </span>
    </el-dialog>

    <!--修改信息-->
    <el-dialog
      title="商户信息"
      :visible.sync="changeUserInfoDialog"
      width="576px"
      :before-close="changeUserInfoDialogClose">

      <div>
        <el-form ref="infoForm" :model="infoForm" label-width="120px">
          <el-form-item label="商户LOGO：">
            <el-upload
              class="logo-uploader"
              :action="url"
              :data="filesData"
              name="files"
              :show-file-list="false"
              :on-success="successSubmitImage"
              :on-error="failedSubmitImage"
              :before-upload="checkImage"
              :headers="headers">
              <img v-if="faceImgURL" :src="faceImgURL" class="logo"/>
              <i v-else class="el-icon-plus logo-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="changeUserInfoDialogClose">取 消</el-button>
    <el-button type="primary" @click="saveInfo">提 交</el-button>
  </span>
    </el-dialog>

    <!--商户详情-->
    <el-dialog
      title="商户详情"
      :visible.sync="detailDialog"
      width="576px">
      <el-form :model="detailForm" ref="detailForm" label-width="100px">
        <el-form-item label="商户ID">
          <span>{{detailForm.id}}</span>
        </el-form-item>
        <el-form-item label="商户名称">
          <span>{{detailForm.name}}</span>
        </el-form-item>
        <el-form-item label="联系方式">
          <span>{{detailForm.phone}}</span>
        </el-form-item>
        <el-form-item label="商户密钥">
          <span>{{detailForm.appKey}}</span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>


  </el-menu>
</template>
<script>
  import {mapGetters} from 'vuex'
  import breadcrumb from '@/components/breadcrumb'
  import hamburger from '@/components/hamburger'
  import {MessageBox} from 'element-ui'
  import {updatePwd} from '@/modules/user/api/user'
  import {getMerchantDetail, editMerchant, detail} from '@/modules/layout/components/api/merchant'
  import {returnThumbnailUrl, returnFilesUrl, uploadUrl} from '@/modules/file/api/upload' //图片操作API
  export default {
    name: 'navbar',
    data () {
      return {
        username: '你好，' + (sessionStorage.name ? sessionStorage.name : sessionStorage.username),
        userType: '',//用户类型
        resetPasswordDialog: false,//修改密码对话框
        changeUserInfoDialog: false,//修改信息对话框
        detailDialog: false,//商户详情对话框
        resetForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
        infoForm: {
          faceImgId: '',//头像id
        }, //头像id
        faceImgURL: '',//头像地址
        //***************************file upload
        filesData: {
          module: 'image'
        },
        url: uploadUrl + '/user',
        headers: {
          authorized: sessionStorage.token
        },
        detailForm: {

        }
      }
    },
    components: {
      breadcrumb,
      hamburger
    },
    mounted () {
      /**2019.05.31 xu**/
      this.userType = sessionStorage.userType || '3'
      this.mountedGetPhoto()
    },
    methods: {
      toggleBar () {
        this.$store.dispatch('toggleBar')
      },
      logout () {
        MessageBox.confirm('是否退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          sessionStorage.clear()
          location.reload()
        })
      },
      //重置密码
      resetPasswordDialogOpen: function () {
        // console.log(111)
        //获取被修改的ID
        this.resetPasswordDialog = true
      },
      resetPasswordDialogClose: function () {
        this.resetForm.password = ''
        this.resetPasswordDialog = false
      },
      detailDialogOpen: function () {
        this.detailDialog = true
        //保存密码
        detail().then(response => {
          this.detailForm = response.obj
        }).catch(() => {
          this.loading = false
        })
      },
      saveNewPssword: function () {
        if (this.resetForm.newPassword != this.resetForm.confirmPassword) {
          this.$message({
            message: '两次密码输入不一致',
            type: 'error'
          })
          return
        }
        //保存密码
        updatePwd(this.resetForm.oldPassword, this.resetForm.newPassword).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.resetForm.password = ''
          this.resetPasswordDialog = false
        }).catch(() => {
          this.loading = false
        })
      },

      /**
       * 修改信息  2019-05-31
       */
      changeUserInfoDialogOpen: function () {
        this.mountedGetPhoto()

        this.changeUserInfoDialog = true
      },
      changeUserInfoDialogClose: function () {
        this.infoForm.faceImgId = ''
        this.changeUserInfoDialog = false
      },
      /**
       * 获取照片
       */
      mountedGetPhoto: function () {
        getMerchantDetail().then(res => {
          let data = res.msg
          if (data === '') {
            let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC'
            this.faceImgURL = base64
          } else {
            this.infoForm.faceImgId = data
            sessionStorage.setItem('face', data)
            this.faceImgURL = returnFilesUrl(data) + '?t=' + Math.random()
          }
        }).catch(e => {

        })
      },

      /**
       * 换取图片
       */
      getImg: function (val) {
        let reg = /^[0-9]*$/
        if (reg.test(val)) {
          return returnFilesUrl(val)
        } else {
          let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC'
          return base64
        }

      },
      saveInfo: function () {
        let pid = this.infoForm.faceImgId
        if (pid == '') {
          this.$message.error('您还未上传头像')
          return
        }
        editMerchant(pid).then(res => {
          this.$message.success(res.msg)
          this.changeUserInfoDialogClose()
        }).catch(e => {

        })
      },
      successSubmitImage (response, file) {
        //保存图片ID
        console.log(response)
        this.$message({
          message: '头像上传成功！',
          type: 'success'
        })
        this.infoForm.faceImgId = response.obj
        this.faceImgURL = returnFilesUrl(response.obj)
      },

      /**
       * 上传失败
       */
      failedSubmitImage () {
        this.$message({
          message: '图片上传失败',
          type: 'error'
        })
      },
      /**
       * 对类型、大小做限制
       */
      checkImage (file) {
        let isImage = file.type.substring(0, 5) === 'image'
        if (!isImage) {
          this.$message.error('只允许图片格式（jpg / jpeg / png）')
          return false
        }
        return true
      },

    },
    computed: {
      ...mapGetters([
        'isClosed'
      ])
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 85px;
    line-height: 85px;
    border-radius: 0 !important;

    .hamburger-container {
      line-height: 85px;
      height: 85px;
      float: left;
      padding: 5px 10px 0 10px;
    }

    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }

    .avatar-container {
      height: 85px;
      display: inline-block;
      position: absolute;
      right: 70px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }

  .el-dropdown-link {
    cursor: pointer;
  }

  /*图片上传*/
  .logo-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .logo-uploader:hover {
    border-color: #409EFF;
  }

  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .logo {
    width: 178px;
    height: 178px;
    display: block;
  }

  .image_tips {
    font-size: 12px;
    color: #1e6abc;
    vertical-align: middle;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #99a9bf;
  }

  .username {
    right: 210px !important;
    color: #333333;
    font-size: 14px;
  }

  .messageicon {
    padding-top: 5px;
    right: 160px !important;
  }

  .powerIcon {
    cursor: pointer;
    right: 35px !important;
  }
</style>
