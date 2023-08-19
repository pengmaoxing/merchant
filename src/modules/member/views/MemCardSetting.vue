<!--添加优惠券还没做-->
<!--灯带新增卡券组件-->
<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">

      <el-tabs v-model="tabsNum" @tab-click="changeTabs">
        <el-tab-pane label="会员基础信息" name="0">

          <el-row>
            <!--虚拟手机界面-->
            <el-col :span="8">
              <div class=" ">

                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>预览</span>
                  </div>
                  <div class="card_preview">
                    <!--动态卡片-->
                    <div class="cover_bg"
                         :style="{background:BGcoverUrl,backgroundPosition:'center center',backgroundSize:'100%'}">
                      <!--头像与名字-->
                      <div class="card_top">
                        <div class="card_logo">
                          <img :src="getImg(logo)+ '?t=' + Math.random()" alt="logo" v-if="logo">
                        </div>
                        <div class="card-top-right">
                          <div class="line1">{{setCardForm.merchantName||'预览卡'}}</div>
                          <div class="line2">{{setCardForm.name}}</div>
                        </div>
                      </div>
                      <div class="card-bottom">
                        <div class="border-card-number">会员卡号</div>
                        <div class="card-number">{{setCardForm.cardNumber|cardNumberFil}}</div>
                      </div>
                      <div class="card-details" @click="cardDetailOpen">
                        <img src="../../../assets/images/member/card-cover-button.png" alt="">
                      </div>

                    </div>

                  </div>
                </el-card>


              </div>
            </el-col>
            <!--表单容器-->
            <el-col :span="15" :offset="1">
              <div class=" ">
                <!--表单卡片-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>会员卡基础信息</span>
                  </div>
                  <!--卡券实际表单-->
                  <div>

                    <el-form label-width="120px" v-show="!mode">
                      <el-form-item label="商户logo：">
                        <img :src="getImg(logo)+'?t='+Math.random()" alt="logo" v-if="logo"
                             width="60" height="60"
                             class="logo face-logo">
                        <span class="logo_tips">如需修改，请前往商户信息更新，更新后将在下次打开页面时同步获取</span>
                      </el-form-item>

                      <el-form-item label="会员卡封面：">
                        <img :src="getImg(setCardForm.backgroundPictureId)" alt="cover"
                             v-if="setCardForm.backgroundPictureId" class="logo face-logo">
                        <span v-else>默认（橙色）</span>
                      </el-form-item>

                      <el-form-item label="会员卡名称：">
                        <span>{{setCardForm.name}}</span>
                      </el-form-item>

                      <el-form-item label="会员期限：">
                        <el-radio v-model="setCardForm.expTime||'1'" label="1" :disabled="true">永久有效</el-radio>
                      </el-form-item>


                      <el-form-item label="联系电话：">
                        <span>{{setCardForm.phone||'--'}}</span>
                      </el-form-item>

                      <el-form-item label="会员特权说明：">
                        <span>{{setCardForm.privilegeExplain||'--'}}</span>
                      </el-form-item>

                      <el-form-item label="使用须知：">
                        <span>{{setCardForm.tip||'--'}}</span>
                      </el-form-item>
                      <el-divider content-position="left">会员卡领卡设置</el-divider>

                      <el-form-item label="领取方式：">
                        <el-radio v-model="setCardForm.acceptWay||'1'" :label="1" :disabled="true">免费激活领取</el-radio>
                      </el-form-item>

                      <el-form-item label="领取赠送：">
                        <span v-if="setCardForm.presentScores">赠送 {{setCardForm.presentScores}} 积分</span>
                        <br v-if="setCardForm.presentScores"/>
                        <span v-if="bindCardCouponId">赠送

                          <el-button type="text" @click="addCouponOpen">{{bindCardCouponName}} </el-button>

                          卡券</span>
                      </el-form-item>


                    </el-form>

                    <el-form v-show="mode" ref="setCardForm" :rules="setCardRules" :model="setCardForm"
                             label-width="120px">
                      <el-form-item label="商户Logo">
                        <!--图片回显-->
                        <img :src="getImg(setCardForm.merchantPhotoId)" alt="logo"
                             v-if="setCardForm.merchantPhotoId" class="logo">
                        <i v-else>暂无图片&nbsp&nbsp</i>
                        <span style="font-size: 12px;color: #99a9bf">如需修改，请前往商户信息更新，更新后将同步获取</span>
                        <!--图片回显-->
                      </el-form-item>

                      <el-form-item label="会员卡封面">
                        <el-radio v-model="coverType" label="0">背景色</el-radio>
                        <el-radio v-model="coverType" label="1">自定义图片</el-radio>
                      </el-form-item>

                      <el-form-item label="" v-if="coverType==0">
                        <el-radio v-model="setCardForm.backgroundPictureId" label="">橙色</el-radio>
                      </el-form-item>

                      <el-form-item label="" v-if="coverType==1">
                        <!--文件上传-->
                        <el-upload
                          class="logo-uploader"
                          :action="url"
                          :data="filesData"
                          name="files"
                          :show-file-list="false"
                          :on-success="coverimage"
                          :on-error="handleImageFailed"
                          :before-upload="beforeLogoUpload"
                          :headers="headers">
                          <img v-if="coverUrl" :src="coverUrl" class="logo">
                          <i v-else class="el-icon-plus logo-uploader-icon"></i>
                        </el-upload>
                        <span style="font-size: 12px;color: #99a9bf">大小1M，支持jpg、png、jpeg格式</span>
                        <!--文件上传-->
                      </el-form-item>

                      <el-form-item label="会员卡名称" prop="name">
                        <el-input v-model="setCardForm.name" placeholder="请输入会员卡名称（9个字以内）"
                                  style="width: 260px"></el-input>
                      </el-form-item>

                      <el-form-item label="会员卡期限" prop="expired">
                        <el-radio v-model="setCardForm.expired||'1'" label="1">永久有效</el-radio>
                      </el-form-item>

                      <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="setCardForm.phone" placeholder="请输入商户的联系电话" style="width: 260px"></el-input>
                      </el-form-item>

                      <el-form-item label="会员特权说明" prop="privilegeExplain">
                        <el-input
                          type="textarea"
                          :rows="6"
                          placeholder="建议填写会员权益等信息"
                          v-model="setCardForm.privilegeExplain"
                          show-word-limit
                          maxlength="1024"
                          :style="formwidth">
                        </el-input>
                      </el-form-item>

                      <el-form-item label="使用须知" prop="tip">
                        <el-input
                          type="textarea"
                          :rows="6"
                          placeholder="建议填写会员使用须知"
                          v-model="setCardForm.tip"
                          show-word-limit
                          maxlength="500"
                          :style="formwidth">
                        </el-input>
                      </el-form-item>

                      <el-divider content-position="left">会员卡领卡设置</el-divider>

                      <el-form-item label="领取方式">
                        <el-radio v-model="setCardForm.acceptWay||1" :label="1">免费激活领取</el-radio>
                      </el-form-item>

                      <el-form-item label="领取赠送">
                        <div>
                          <el-checkbox v-model="giftPointsStatus" class="block"></el-checkbox>
                          赠送
                          <el-input v-model="setCardForm.presentScores" :disabled="!giftPointsStatus"
                                    placeholder="输入积分" class="block" style="width: 150px"></el-input>
                          积分
                        </div>
                        <div style="margin-top: 10px;vertical-align: middle">
                          <el-checkbox v-model="giftCouponStatus" class="block"></el-checkbox>

                          <span>赠送优惠券
                            <span @click="addCouponOpen" v-if="bindCardCouponId==''"
                                  style="color: #409eff;cursor: pointer">添加优惠券</span>
                            <span @click="addCouponOpen" v-if="bindCardCouponId!=''"
                                  style="color: #409eff;cursor: pointer">{{bindCardCouponName}}</span>
                          </span>

                          <p>注：优惠券过期则不赠送，请核对有效期</p>

                        </div>

                      </el-form-item>

                    </el-form>

                    <div style="text-align: center">
                      <el-button type="primary" v-if="!mode" @click="editModeOpen">修 改</el-button>
                      <el-button type="primary" v-if="mode" @click="checkForm" v-loading="btnLoading"
                                 :disabled="btnLoading">保存并提交
                      </el-button>
                      <el-button type="" v-if="mode" @click="editModeClose">取 消</el-button>
                    </div>
                  </div>

                </el-card>

              </div>


              <!--同步支付宝会员卡-->
              <div style="margin-top: 10px">
                <el-button type="primary" @click="saveAliMember" class="block">同步到支付宝会员卡</el-button>
                <el-input type="primary" v-model="cardUrl" class="block" style="width: 600px"></el-input>
              </div>
              <!--表单容器结束-->

            </el-col>
          </el-row>
        </el-tab-pane>
        <!--<el-tab-pane label="第三方会员卡同步" name="1">-->

        <!--<template>-->
        <!--预留位置-->
        <!--<br>-->
        <!--Reserve...-->
        <!--</template>-->

        <!--</el-tab-pane>-->
      </el-tabs>

    </el-card>


    <!--模态框-->
    <el-dialog
      title="会员卡详情"
      :visible.sync="cardDetailVisible"
      width="576px"
      :before-close="cardDetailClose">
      <div>
        <table class="detailsTable">
          <tr>
            <td>特权说明：</td>
            <td>{{setCardForm.privilegeExplain||'--'}}</td>
          </tr>
          <tr>
            <td>会员期限：</td>
            <td>{{setCardForm.expired||'1' | expiredFil}}</td>
          </tr>
          <tr>
            <td>联系电话：</td>
            <td>{{setCardForm.phone||'--'}}</td>
          </tr>
          <tr>
            <td>使用须知：</td>
            <td>{{setCardForm.tip||'--'}}</td>
          </tr>
        </table>

      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="cardDetailVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <!--添加优惠券-->
    <el-dialog
      title="创建新的优惠卡券"
      :visible.sync="addCouponVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="addCouponClose">
      <div>
        <!--创建卡券  2/模态框模式 子组件保存后关闭父级模态框-->
        <createcoupon openmode="2" :couponid="bindCardCouponId" v-on:closefatherdialog="addCouponClose"
                      v-on:closefatherdialogbysavesuccess="addCouponCloseBySave"
                      v-if="createcouponReset"></createcoupon>
      </div>
      <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="addCouponVisible = false">关 闭</el-button>-->
      <!--</span>-->
    </el-dialog>

  </div>
</template>

<script>
  import {
    getMemCardDetail,
    saveMemCardDetail,
    findBindCardCoupon,
    deleteCoupon,
    getMerchantDetail,
    getAliMemberDetail,
    saveAliMember
  } from '../api/MemCardSetting'//api
  import createcoupon from '@/components/createCoupon/index' //引入卡券组件
  import {returnThumbnailUrl, returnFilesUrl, uploadUrl} from '@/modules/file/api/upload' //图片操作API
  export default {
    name: 'MemCardSetting',
    components: {createcoupon}, //创建卡券组件
    data() {

      var formPhoneCheck = (rule, value, callback) => {
        let reg = /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/;
        if (!reg.test(value)) {
          callback(new Error('请输入手机号码或电话号码'))
        } else {
          callback()
        }
      };

      return {
        loading: true,
        tabsNum: '0',//标签页号数
        userName: '',//虚拟卡名字
        btnLoading: false,

        setCardForm: {
          acceptWay: '',
          backgroundPictureId: '',
          couponId: '',
          createTime: '1',
          id: '',
          merchantId: '',
          merchantPhotoId: '',
          name: '',
          phone: '',
          presentScores: '',
          privilegeExplain: '',
          tip: '',
          updateTime: '',
          expTime: '1'
        },
        coverType: '0', //0默认 1自定义背景
        giftPointsStatus: '', //赠送积分
        giftCouponStatus: '', //赠送卡券
        //----------------------------------绑定的优惠券
        bindCardCouponId: '', //绑定的卡券Id
        bindCardCouponName: '',//绑定的卡券名字

        createcouponReset: false,

        //----------------------------------
        formwidth: 'width: 360px',
        coverUrl: '',
        BGcoverUrl: '',
        logo: '',
        cardDetailVisible: false,//虚拟H5详情模态框
        addCouponVisible: false,//添加优惠券

        mode: false, //f显示模式 t 编辑模式
        //图片上传-------------------
        filesData: {
          module: 'image',
        },
        url: uploadUrl + '/user',
        headers: {
          authorized: sessionStorage.token
        },
        //校验规则
        setCardRules: {
          name: [
            {required: true, message: '请输入会员卡名称', trigger: 'blur'},
            {min: 2, max: 9, message: '长度在 2 到 9 个字符', trigger: 'blur'}
          ],
          phone: [
            {validator: formPhoneCheck, trigger: 'blur'}
          ],
          privilegeExplain: [
            {required: true, message: '请输入会员特权说明（最长1024个汉字）', trigger: 'blur'},
            {min: 1, max: 1024, message: '长度在 1 到 1024 个字符', trigger: 'blur'}
          ],
          tip: [
            {required: true, message: '请输入使用须知（最长500个汉字）', trigger: 'blur'},
            {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
          ]
        },

        //会员卡
        cardUrl: '',
      }
    },
    watch: {
      //如果取消勾选，则取消优惠券
      giftCouponStatus(nv, ov) {
        if (nv == false) {
          // this.deleteCouponSubmit()  20190612不直接删除
          //this.bindCardCouponId = ''//绑定的卡券Id
          this.bindCardCouponName = ''//绑定的卡券名字
        } else {
          this.findBindCardCoupon()
        }
      },
      //检查积分设置
      giftPointsStatus(nv, ov) {
        if (nv == false) {
          this.setCardForm.presentScores = 0
        }
      }
    },
    created() {
      this.logo = sessionStorage.getItem('face') || '';
    },
    mounted() {
      this.userName = sessionStorage.getItem('username');
      //获取照片
      this.mountedGetPhoto();
      //获取详情
      this.getMemCardDetail();
      //获取绑定卡券
      this.findBindCardCoupon()
      //支付宝
      this.getAliMemberDetail()
    },
    filters: {
      // 会员卡期限中文过滤器
      expiredFil: function (val) {
        let text = '';
        let v = parseInt(val);
        switch (v) {
          case 1:
            text = '永久有效';
            break;
          default :
            break
        }
        return text
      },
      //
      cardNumberFil: function (val) {
        if (val == '' || val == null || val == undefined) {
          return '无卡号'
        } else {
          return val.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")
        }
      }
    },
    methods: {

      /**
       * 获取支付宝卡详情
       */
      getAliMemberDetail: function () {
        getAliMemberDetail().then(res => {
          let data = res.obj;
          this.cardUrl = data.openCardLink || ''
        }).catch(e => {
        })
      },

      saveAliMember: function () {
        saveAliMember().then(res => {
          let data = res.obj;
          this.cardUrl = data.openCardLink || ''
        }).catch(e => {

        })
      },

      /**
       * 切换标签页
       */
      changeTabs: function () {

      },

      /**
       *检查是否有绑定会员卡
       */
      findBindCardCoupon: function () {
        findBindCardCoupon().then(res => {
          let data = res.obj;
          //检查是否有绑定卡片
          if (data != null) {
            this.bindCardCouponId = data.id;//绑定的卡券Id
            this.setCardForm.couponId = data.id;
            this.bindCardCouponName = data.name;//绑定的卡券名字
            this.giftCouponStatus = true
          }

        }).catch(e => {

        })
      },

      /**
       * 获取照片
       */
      mountedGetPhoto: function () {
        getMerchantDetail().then(res => {
          let data = res.msg;
          this.logo = data
        }).catch(e => {

        })
      },

      /**
       * 获取会员卡详情
       */
      getMemCardDetail: function () {
        getMemCardDetail().then(res => {
          this.setCardForm = res.obj;

          if (res.obj.backgroundPictureId != null && res.obj.backgroundPictureId != '') {
            this.BGcoverUrl = 'url("' + returnFilesUrl(res.obj.backgroundPictureId) + '")';
            this.coverUrl = returnFilesUrl(res.obj.backgroundPictureId)
          } else {
            this.BGcoverUrl = '';
            this.coverUrl = ''
          }
          //检查是否有自定义背景
          if (res.obj.backgroundPictureId) {
            this.coverType = '1' //如果有背景ID，则选项被切换为自定义背景模式 coverType
          }
          //检查是否有赠送积分
          if (res.obj.presentScores == null || res.obj.presentScores == 0) {
            this.giftPointsStatus = false
          } else {
            this.giftPointsStatus = true
          }

          //如果从导航栏中获取商户logo获取失败，则从会员卡详情中获取,并且重新赋值给session->face
          if (this.logo === '') {
            this.logo = this.setCardForm.merchantPhotoId
            sessionStorage.setItem('face', this.setCardForm.merchantPhotoId)
          }

          this.loading = false //关闭加载转圈
        }).catch(e => {

        })
      },

      /**
       * 进入编辑模式
       */
      editModeOpen: function () {

        this.mode = true
      },
      /**
       * 退出编辑模式
       */
      editModeClose: function () {

        this.mode = false
      },
      /**
       * 检查设置数据
       */
      checkForm: function () {
        let oriForm = this.setCardForm;
        let nowForm = this.deepCopy(oriForm);
        console.log(nowForm);
        //数据处理
        //领取渠道 固定1
        nowForm.acceptWay = '1';
        //如果没有上传
        if (this.coverType == 0) {
          nowForm.backgroundPictureId = ''
        }
        console.warn(this.giftCouponStatus);
        if (this.giftCouponStatus == false) {
          this.deleteCouponSubmit() //如果保存时候确认取消优惠券，则提交删除
        }
        console.log(nowForm);
        this.submitForm(nowForm) //提交数据
      },

      /**
       * 删除卡券
       */
      deleteCouponSubmit: function () {
        let id = this.bindCardCouponId;
        // 进入删除
        console.log(`进入删除${id}`);
        if (id != '') {
          deleteCoupon(id).then(res => {
            this.bindCardCouponId = ''//彻底销毁绑定的卡券Id
          }).catch(e => {

          })
        }
      },

      /**
       * 提交会员卡的设置参数
       */
      submitForm: function (data) {
        this.btnLoading = true; //加锁
        this.$refs['setCardForm'].validate((valid) => {
          if (valid) {
            //校验正确
            saveMemCardDetail(data).then(res => {
              this.btnLoading = false; //解锁
              this.$message.success('修改成功');
              this.mode = false; //退回显示模式
              this.getMemCardDetail()
            }).catch(e => {
              this.btnLoading = false //解锁
            })

          } else {
            //校验失败
            console.log('error submit!!');
            this.btnLoading = false; //解锁
            return false
          }
        })

      },

      /**
       * 打开详情模态框
       */
      cardDetailOpen: function () {
        this.cardDetailVisible = true
      },

      /**
       * 关闭详情模态框
       */
      cardDetailClose: function () {
        this.cardDetailVisible = false
      },

      /**
       * 打开新增模态框
       */
      addCouponOpen: function () {
        //重置组件
        this.createcouponReset = false;
        this.$nextTick(() => {
          this.createcouponReset = true
        });
        //再打开模态框
        this.addCouponVisible = true
      },

      /**
       * 关闭新增模态框 【保存成功】
       */
      addCouponCloseBySave: function (data = '') {
        if (data != '') {
          console.log(data);  //接受卡券名字和id
          this.giftCouponStatus = true //创建成功后，将赠送卡券勾选
        }
        this.findBindCardCoupon(); //成功后获取新的卡券信息
        //关闭模态框
        this.addCouponVisible = false
      },

      /**
       * 关闭新增模态框 【取消按钮】
       */
      addCouponClose: function (data = '') {
        //关闭模态框
        this.addCouponVisible = false
      },

      /**
       * 深拷贝
       */
      deepCopy: function (obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
              result[key] = this.deepCopy(obj[key])   //递归
            } else {
              result[key] = obj[key]
            }
          }
        }
        return result
      },

      /**
       * 换取图片
       */
      getImg: function (val) {
        let reg = /^[0-9]*$/;
        if (reg.test(val) && val != '') {
          return returnFilesUrl(val)
        } else {
          let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAFLklEQVR42u2dfVPyMAzA9/0/GyLKy4kep6Kgk0NRFJ2gPD13t+vTbqVbm6QdyV+Ks01/ZFmbplmyZ0GRhBEwaAbNwqAZNINmYdAMmoVBM+gG8v7+3rGWx8dHBl1POs4yn88ZdKWkadrxLQz6P/n5+emAyenpKYO2dRTj8fj397f03xeLhU0L9/f3xwsa4q6fzWZhepIkNMqDwQDUF11fXx8LaOEEShEMh0O0r7P9oD8+PpBHfn5+rnfX6/XaDPrl5UUf8/f3N5WnaifozWZDO9TpdEqoAB7oEBzlaDSiUiOhokw12dIfxTjzkISKMiHr3W6HrwY46OVyGWA4Al+NhNCcg2ItZoERg1YGc3t7Kz48OzsLk3VVOCV00NvttopmIKz1lXqUoM1jCIR1+0GHM+fzHtJCBd3r9WzwhWDXOL0n5NqTs1Y89Ww2ixX08/Oz+WJy1ghdJ4HoTeuvlVBqm0GT2zX0BiM46FrhZkLW0J36By08sovGVKzjA+2uMQlrcecdHWgq1hGDdllo4bOWO3p9fY0J9MPDg8ebA5o16LYLLOgsyxxbw7Rr0PA0LGixunVvEI213P7JyUlMoH2F0nFYg7YPC/rz8xOIAgQLueV+vx8T6Lu7O48tQ9s1nObgoLvdrt/GQVnLbW42m6NYsJCwPsaVIb6/FiuUyECLByDCnNe7XccXVFKUXi6XUbCOHjTootkja9BABxTowWCAFgnywjrWPUNF9cvLy8BZtwQ0QijZhbVyYvfr6ysm0GJlRbsX1XgDHkg9ypSwQOxavnixWEQPGuiWdGTdhiRHEqOuxVo/p9US0FRJGpbprKAqYR+twDm+aWPXyp9Wq1XcoKkciJl1Cw8LCRkOh0GxHo/HLTz+Ruus9xbHwrzsIIcCmpZ1qV0X1o2jA2p1A32c2+2WkDVmuSXseh1UpTP0fr1nboQFusppwq0bS7vzmAcRLug9VgWei4uL0l7SNMUfMlnxqm63C4dbON/QCoVRlmObTCaGWVeDXKH1eh1sYUf6AoNXV1eWNRmn0+nb29tutxP/JXz609NTlXMIsHZmKLVJ4Upmos0g4wANgRs6ThQx6FzMZS/jKrIbNGhZsixTkhdiKRgdGejWCINm0AyahUEzaAbNCBg0g2Zh0C0BXZTOtbm43+9DHEEFFcPoHKMoh0Hr6SalQRz7EI+vN2CJX70HniIDbQ7xMOjmt5W7Hg1ayEHrn6dpavZXuekEClrupnSEgYDO340xmUyiBJ33IbSf/0mu6FySvY8XX7mD1ov3l6oROujGD0Mc0KvVqkinU0TZVj8IGmJDxwq0UrzCxnU0PuzXDLTyygb5siLHw951kIE2m1J+2psQdH7UbjQa6e3kP6/Xa3cfjbFgybKscM0G1yE/62tVQW9mPvL3rZQjM5tboKCr0n/kWW3VCRE00OYu4gB90HUU34SLxspDta4ayuKlqF0hLF1PO48V9P7vZV+OGruAllGKGV5pOST5Ai8PQ1jQcIksLqDFxE720QcVOF7Q+jzBZQmuzOr0kl9m0Dc3N35nRw1Be5+rFVUc3EGXJtvpcY8q0LUO6ccH2n4CrnyugNaTz6tOXMUB2q/r0K+0jzZUuY7S+ah8nOLoLNpwRNsFdFWYyQzaPtM3JtDFu191B+oXtKXrKKbbEKECGtchryyUEIR9pLB0keKiW63znRGALr2Ra/VS9Z25gC7iq0DBLxrXka/NvCxqPbqO0nuLEjQLaqyDhUEzaAbNCBg0g2Zh0AyaQbMw6DbJP0zQqPbAWqsMAAAAAElFTkSuQmCC';
          return base64
        }

      },
      /**
       * 卡片背景图片上传
       */
      coverimage(response, file) {
        //保存图片ID
        console.log(response);
        this.$message({
          message: '*背景图片上传成功！',
          type: 'success'
        });

        this.setCardForm.backgroundPictureId = response.obj;
        console.log(returnThumbnailUrl(response.obj));
        this.coverUrl = returnFilesUrl(response.obj);
        this.BGcoverUrl = 'url("' + returnFilesUrl(response.obj) + '")'
      },
      /**
       *上传失败
       */
      handleImageFailed() {
        this.$message({
          message: '图片上传失败',
          type: 'error'
        })
      },
      /**
       *对类型、大小做限制
       */
      beforeLogoUpload(file) {
        let isImage = file.type.substring(0, 5) === 'image';
        if (!isImage) {
          this.$message.error('只允许图片格式（jpg / jpeg / png）');
          return false
        }
        return true
      },

    }
  }
</script>

<style scoped>
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .card_preview {
    margin: 0 auto;
    width: 358px;
    height: 637px;
    background: url("../../../assets/images/member/h5-base-bg.png") no-repeat;
  }

  .cover_bg {
    position: relative;
    top: 75px;
    left: 22px;
    border-radius: 10px;
    width: 320px;
    height: 175px;
    background-size: 100% !important;
    background-position: center center !important;
    background: url("../../../assets/images/member/card-cover-default.png") no-repeat;
  }

  .card_top {
    padding-left: 20px;
    padding-top: 15px;
    position: absolute;
    top: 0;
  }

  .card_logo {
    display: inline-block;
    width: 36px;
    height: 36px;
    border: 3px solid #ffffff;
    border-radius: 50% 50%;
    background-color: #D8D8D8;
    vertical-align: top;
  }

  .card_logo img {
    width: 30px;
    height: 30px;
    border-radius: 50% 50%;
  }

  .card-top-right {
    display: inline-block;
    margin-left: 10px;
    color: #ffffff;
  }

  .line1 {
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.5);
  }

  .line2 {
    font-size: 12px;
    line-height: 17px;
    opacity: 0.8;
  }

  .card-bottom {
    padding-left: 20px;
    color: #ffffff;
    position: absolute;
    bottom: 0;
    height: 56px;
  }

  .border-card-number {
    display: inline-block;
    border-radius: 2px;
    border: 1px solid #ffffff;
    font-size: 10px;
    line-height: 16px;
    width: 55px;
    height: 18px;
    text-align: center;
    margin-bottom: 5px;
  }

  .card-number {
    font-size: 18px;
    line-height: 25px;
  }

  .card-details {
    position: absolute;
    bottom: 15px;
    right: 0;
    cursor: pointer;
  }

  .card-details img {
    vertical-align: middle;
  }

  .logo_tips {
    font-size: 13px;
    color: #8b8b8b;
  }


  /*picture*/
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
    width: 120px;
    height: 120px;
    display: block;
    overflow: hidden;
  }

  .face-logo {
    border-radius: 8px;
  }

  .detailsTable {
    width: 100%;
  }

  .detailsTable tr {
    height: 40px;
    color: #808080;
  }

  .detailsTable tr td:nth-child(1) {
    width: 100px;
    text-align: right;
  }


</style>
