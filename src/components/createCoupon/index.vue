<template>
  <div class="public-width">
    <el-form ref="couponForm" :rules="rules" :model="couponForm" size="medium" :label-width="formLabelWidth">
      <!--主要信息-->
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>主要信息</span>
          <span style="float: right">
            <el-button type="text" v-if="openmode==1" @click="closeCoupon">返回上一页</el-button>
          </span>
        </div>
        <!--内容-->
        <div>
          <!--卡券名称-->
          <el-form-item label="卡券名称：" prop="name">
            <el-input v-model="couponForm.name"
                      class="formItemWidthMax"
                      placeholder="请输入卡券名称"
                      :size="formSize"></el-input>
            <span class="tips">{{tips}}</span>
          </el-form-item>
          <!--卡券面值-->
          <el-form-item label="卡券面值：" prop="money">
            <el-input v-model="couponForm.money"
                      class="formItemWidthMin"
                      placeholder="请输入卡券面值"
                      :size="formSize"></el-input>
            <span class="unit-txt">元</span>
          </el-form-item>
          <!--卡券面值Logo 文件上传-->
          <el-form-item label="卡券Logo：" prop="photoId">
            <!--文件上传-->
            <el-upload
              class="logo-uploader"
              :action="url"
              :data="filesData"
              name="files"
              :show-file-list="false"
              :on-success="uploadLogoImg"
              :on-error="handleImageFailed"
              :before-upload="beforeLogoUpload"
              :headers="headers">
              <img v-if="couponLogoImgUrl" :src="couponLogoImgUrl" class="logo">
              <i v-else class="el-icon-plus logo-uploader-icon"></i>
            </el-upload>
            <!--法人证件文件上传-->
          </el-form-item>

          <!--有效期-->
          <el-form-item label="有效期：" required>
            <div>
              <el-radio v-model="couponForm.validType" :label="0" class="block no-margin-right">
                领取后立即生效
              </el-radio>
              <el-form-item class="block" style="padding: 0 0 0 10px" prop="claimedTime">
                有效期为
                <el-input v-model="couponForm.claimedTime" size="medium" class="width100"
                          :disabled="couponForm.validType==1"></el-input>
                天
              </el-form-item>
            </div>
            <p></p>
            <div>
              <el-radio v-model="couponForm.validType" :label="1" class="radio-inline block no-margin-right">
                固定日期
              </el-radio>

              <el-form-item class="block" style="padding: 0 0 0 10px" prop="validTimeStart">
                <el-date-picker
                  v-model="couponForm.validTimeStart"
                  type="date"
                  size="medium"
                  class="width190"
                  :disabled="couponForm.validType==0"
                  placeholder="选择开始日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <span>至</span>
              <el-form-item class="block" prop="validTimeEnd">
                <el-date-picker
                  v-model="couponForm.validTimeEnd"
                  type="date"
                  size="medium"
                  class="width190"
                  :disabled="couponForm.validType==0"
                  placeholder="选择结束日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-form-item>

          <!--发放总量-->
          <el-form-item label="发放总量：" required>
            <div class="block">
              <el-select v-model="inventoryMode" :size="formSize">
                <el-option label="不限制" :value="1"></el-option>
                <el-option label="设定卡券总库存" :value="2"></el-option>
              </el-select>
            </div>
            <div class="block formPadding10" v-if="inventoryMode==2">
              <el-form-item prop="totalInventory">
                <el-input v-model="couponForm.totalInventory"
                          class="formItemWidthMin"
                          placeholder="请输入库存量"
                          :size="formSize"></el-input>
                <span class="unit-txt">张</span>
              </el-form-item>

            </div>
          </el-form-item>

          <!--活动有效时间-->
          <el-form-item label="活动有效时间：" required>
            <el-form-item class="block" prop="actTimeStart">
              <el-date-picker
                v-model="couponForm.actTimeStart"
                type="datetime"
                class="width200"
                placeholder="选择开始日期时间"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <span>至</span>
            <el-form-item class="block" prop="actTimeEnd">
              <el-date-picker
                v-model="couponForm.actTimeEnd"
                type="datetime"
                class="width200"
                placeholder="选择结束日期时间"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-form-item>

          <!--卡券说明-->
          <el-form-item label="卡券说明：" prop="remark">
            <el-input
              type="textarea"
              :rows="6"
              placeholder="输入卡券说明"
              v-model="couponForm.remark"
              show-word-limit
              style="width: 400px"
              maxlength="500">
            </el-input>
          </el-form-item>


        </div>
      </el-card>

      <!--规则配置-->
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>规则配置</span>
        </div>
        <!--内容-->
        <!--最低消费-->
        <el-form-item label="最低消费：" required>
          <div class="block">
            <el-select v-model="minimumMode" :size="formSize">
              <el-option label="不限制" :value="1"></el-option>
              <el-option label="设定最低消费金额" :value="2"></el-option>
            </el-select>
          </div>
          <div class="block formPadding10" v-if="minimumMode==2">
            <el-form-item prop="miniExpendLimit">
              <el-input v-model="couponForm.miniExpendLimit"
                        class="formItemWidthMin"
                        placeholder="最低消费金额"
                        :size="formSize"></el-input>
              <span class="unit-txt">元</span>
            </el-form-item>
          </div>
        </el-form-item>


        <!--使用时段-->
        <el-form-item label="使用时段：" required>
          <div class="block">
            <el-select v-model="timePeriodMode" :size="formSize">
              <el-option label="不限制" :value="1"></el-option>
              <el-option label="限制使用时段" :value="2"></el-option>
            </el-select>
          </div>
          <div class="" v-if="timePeriodMode==2" style="margin-top: 10px">
            <!--星期选择器-->
            <el-form-item prop="useTimeWeek">
              <el-checkbox-group v-model="couponForm.useTimeWeek" :min="1">
                <el-checkbox label="1">周一</el-checkbox>
                <el-checkbox label="2">周二</el-checkbox>
                <el-checkbox label="3">周三</el-checkbox>
                <el-checkbox label="4">周四</el-checkbox>
                <el-checkbox label="5">周五</el-checkbox>
                <el-checkbox label="6">周六</el-checkbox>
                <el-checkbox label="7">周日</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div style="width: 590px;height: 1px;background-color: #e2e2e2;margin: 10px 0">

            </div>

            <el-form-item prop="timePeriodStartTime" class="block">
              <el-time-select
                placeholder="起始时间"
                v-model="couponForm.timePeriodStartTime"
                class="formItemWidthMin"
                :picker-options="timePOption">
              </el-time-select>
            </el-form-item>

            <el-form-item prop="timePeriodEndTime" class="block">
              <el-time-select
                placeholder="结束时间"
                v-model="couponForm.timePeriodEndTime"
                class="formItemWidthMin"
                :picker-options="timePOption">
              </el-time-select>
            </el-form-item>


          </div>
        </el-form-item>


        <!--每位用户限领-->
        <el-form-item label="每位用户限领：" v-if="openmode==1" required>
          <div class="block">
            <el-select v-model="userLimitMode" :size="formSize">
              <el-option label="不限制" :value="1"></el-option>
              <el-option label="设定每人领取上限" :value="2"></el-option>
            </el-select>
          </div>
          <div class="block formPadding10" v-if="userLimitMode==2">
            <el-form-item prop="claimUpperLimit">
              <el-input v-model="couponForm.claimUpperLimit"
                        class="formItemWidthMin"
                        placeholder="上限数量"
                        :size="formSize"></el-input>
              <span class="unit-txt">张</span>
            </el-form-item>
          </div>
        </el-form-item>


        <!--使用门店-->
        <el-form-item label="使用门店：" required>
          <div class="block">
            <el-select v-model="storeLimitMode" :size="formSize">
              <el-option label="全部门店" :value="1"></el-option>
              <el-option label="指定门店" :value="2"></el-option>
            </el-select>
          </div>
          <div class="block formPadding10" v-if="storeLimitMode==2">
            <div>
              <div v-if="storeListDataSelect.length==0">
                <el-button type="primary" @click="couponSelectStoreOpen">选择门店</el-button>
              </div>
              <div v-else-if="storeListDataSelect.length>0">
                <span>已选{{storeListDataSelect.length}}家，
                <el-button type="text" @click="couponSelectStoreOpen">查看或修改</el-button>
                </span>
              </div>
            </div>
          </div>
        </el-form-item>


        <div>

        </div>
      </el-card>

      <!--其他配置-->
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>其他配置</span>
        </div>
        <!--内容-->
        <!--过期提醒-->
        <el-form-item label="过期提醒：">
          <el-checkbox :true-label="1" :false-label="2" v-model="couponForm.remindType">到期前3天提醒用户1次(卡券有效期必须大于3天)
          </el-checkbox>
        </el-form-item>

        <!--同步发布至-->
        <el-form-item label="同步发布至：">
          <el-checkbox :true-label="1" :false-label="2" v-model="couponForm.couponSourceType">微信卡包
          </el-checkbox>
        </el-form-item>

        <!--卡券颜色-->
        <el-form-item label="卡券颜色：" v-if="couponForm.couponSourceType==1">
          <div class="color-group">
            <div v-for="item in colorGroup" :key="item.value">
              <div class="el-color-picker el-color-picker--medium" @click="selectColor(item.value,item.hex)"><!---->
                <div class="el-color-picker__trigger">
                <span class="el-color-picker__color is-alpha">
                  <span class="el-color-picker__color-inner" :style="{backgroundColor:item.hex}">
                  </span>
                  <span v-show="couponForm.wxColor==item.value" class="el-color-picker__icon el-icon-check"></span>
                </span>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <!--卡券标题-->
        <el-form-item label="卡券标题：" v-if="couponForm.couponSourceType==1" prop="title">
          <el-input v-model="couponForm.title"
                    class="formItemWidthMax"
                    placeholder="卡券标题（自定义内容）"
                    :size="formSize"></el-input>
        </el-form-item>

        <!--手动预览-->
        <el-form-item v-if="couponForm.couponSourceType==1">
          <el-button type="text" @click="couponSyncPreview=true">预览微信卡包样式</el-button>
        </el-form-item>

      </el-card>
    </el-form>
    <!--按钮-->
    <div class="btn-group">
      <el-button type="primary" @click="rulesFormCheck" :loading="btnLoading" :disabled="btnLoading">保存卡券</el-button>
      <el-button type="" @click="cancelCreate">取 消</el-button>
    </div>


    <!--//预览窗-->
    <div class="sim-wxapp" id="wx-app" v-show="couponSyncPreview" @mousedown="mousedown">
      <div class="sim-wxapp-header">
        <span class="dialog-title">卡券预览</span>
        <i class="el-icon-close close-icon" style="float: right" @click="closeDialog"></i>
      </div>
      <div class="sim-body" :style="{backgroundColor:couponColorHex}">
        <!--导航条-->
        <div class="roof-img"></div>
        <!--LOGO-->
        <img :src="getImg(logo)" alt="logo"
             class="sim-logo">
        <!--卡片-->
        <div class="sim-info-panel">
          <div class="info-panel-content">
            <span class="brand-name">{{mName}}</span>
            <br>
            <span class="brand-title">{{couponForm.title||''}}</span>
            <br>
            <el-button size="mini" class="brand-button button-color">立即使用</el-button>
          </div>
          <!--使用条件-->
          <div class="sim-body-time">
            <div class="time-left">使用条件:</div>

            <div v-if="minimumMode==2" class="time-right">满 {{couponForm.miniExpendLimit}} 元可用</div>
            <div v-if="minimumMode==1" class="time-right">满任意金额可用</div>

            <div class="time-left">有效期:</div>
            <div class="time-right">

              <span v-if="couponForm.validType==0">领取后{{couponForm.claimedTime}}天有效</span>
              <span
                v-if="couponForm.validType==1">{{couponForm.validTimeStart||'开始日期'}} 至 {{couponForm.validTimeEnd||'结束日期'}}</span>
              <div v-if="timePeriodMode==1" class="time-checkbox">不限制使用时段</div>
              <div v-if="timePeriodMode==2" class="time-checkbox">{{weekStr||'未设置星期'}}</div>
              <div v-if="timePeriodMode==2 && couponForm.timePeriodStartTime!='' " class="time-checkbox">
                {{couponForm.timePeriodStartTime}}至{{couponForm.timePeriodEndTime}}
              </div>
            </div>

          </div>
          <div class="wx-pa">
            <span class="pa-title">公众号</span>
            <span class="el-icon-arrow-right close-icon" style="float: right"></span>
          </div>
        </div>


      </div>

    </div>

    <!--选择门店模态框-->
    <el-dialog
      title="选择门店"
      :visible.sync="couponSelectStoreVisible"
      width="30%"
      :append-to-body="true"
      :before-close="couponSelectStoreClose">
      <div class="table-box">

        <div>
          <el-input v-model="searchStoreName"
                    placeholder="输入门店名"
                    @input="getStoreListBySelect"
                    size="medium"
                    style="width: 150px"
          ></el-input>
          <el-button size="medium" @click="getStoreListBySelect">搜 索</el-button>
        </div>

        <el-divider></el-divider>
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>

        <div style="overflow-y: scroll" class="store-list-box">
          <table class="store-list">
            <thead>
            <tr>
              <th>操作</th>
              <th>门店</th>
              <th>地址</th>
            </tr>
            </thead>


            <tbody>
            <tr v-for="item in storeListData" :key="item.id">
              <td>
                <el-checkbox v-model="storeListDataSelect"
                             :label="item.id"
                             @change="handleCheckedCitiesChange">
                  &nbsp
                </el-checkbox>
              </td>
              <td>{{item.name}}</td>
              <td>{{item.address}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!--<pagination-->
        <!--:total-elements="storeListDataTotalElement"-->
        <!--:change-callback="getStoreListBySelect"-->
        <!--ref="page"></pagination>-->

      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="couponSelectStoreCancel">取 消</el-button>
    <el-button type="primary" @click="couponSelectStoreSave">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>

  import {returnThumbnailUrl, returnFilesUrl, uploadUrl} from '@/modules/file/api/upload' //图片操作API
  import {
    findStoreList,
    saveCoupon,
    saveCouponByType,
    findSignCouponDetail,
    checkCouponName
  } from '@/components/createCoupon/api/createCoupon' //图片操作API
  import pagination from '@/components/pagination/index'

  export default {
    name: 'index',
    components: {pagination},
    data() {
      //名字检查
      var checkName = (rule, value, callback) => {
        let name = value;
        let lastName = name;
        if (name != '') {
          checkCouponName(name).then(res => {
            if (res.msg == '卡券名称已使用') {
              // this.$message.error('卡券名称已被使用');
              callback(new Error('卡券名称已被使用'))
              //旧名提醒
              this.tips = lastName + ' 已经被使用，请更换一个。'
            } else {
              //可用的话则取消提示
              callback()
              this.tips = ''
            }
          })
        }
      };
      //面值检查
      var checkMoney = (rule, value, callback) => {
        let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
        if (!reg.test(value)) {
          callback(new Error('仅接受非负数，最多精确到两位小数'))
        } else {
          callback()
        }
      };
      //有效期（天数检查）
      let checkClaimedTime = (rule, value, callback) => {
        let mode = this.couponForm.validType;
        if (mode == 0) {
          if (value == 0 || value == '' || value == null) {
            callback(new Error('请输入有效天数'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      //有效期（固定日期检查）
      var checkValidTimeStart = (rule, value, callback) => {
        let mode = this.couponForm.validType;
        let endTime = this.couponForm.validTimeEnd;
        if (mode == 1) {
          if (value == 0 || value == '' || value == null) {
            callback(new Error('请选择开始日期'))
          } else if (endTime != '' && value > endTime) {
            callback(new Error('开始日期不能晚于结束日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      var checkValidTimeEnd = (rule, value, callback) => {
        let mode = this.couponForm.validType;
        let startTime = this.couponForm.validTimeStart;
        if (mode == 1) {
          if (value == 0 || value == '' || value == null) {
            callback(new Error('请选择结束日期'))
          } else if (startTime != '' && value < startTime) {
            callback(new Error('结束日期不能早于开始日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      //活动有效时间检查
      var checkActTimeStart = (rule, value, callback) => {
        let endTime = this.couponForm.actTimeEnd;
        if (endTime != '' && value > endTime) {
          callback(new Error('开始日期不能晚于结束日期'))
        } else {
          callback()
        }
      };
      var checkActTimeEnd = (rule, value, callback) => {
        let startTime = this.couponForm.actTimeStart;
        if (startTime != '' && value < startTime) {
          callback(new Error('结束日期不能早于开始日期'))
        } else {
          callback()
        }
      };
      //发放总量检查
      var checkTotalInventory = (rule, value, callback) => {
        let mode = this.inventoryMode;
        if (mode == 2) {
          if (value == 0 || value == '' || value == null) {
            callback(new Error('请输入库存量'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      //最低消费检查
      var checkMiniExpendLimit = (rule, value, callback) => {
        let mode = this.minimumMode;
        if (mode == 2) {
          if (value == 0 || value == '' || value == null) {
            callback(new Error('请输入最低消费金额'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      //使用时段时间检查
      var checkTimePeriodStartTime = (rule, value, callback) => {
        let mode = this.timePeriodMode;
        if (mode == 2) {
          if (value == 0 || value == '' || value == null) {
            callback(new Error('请输入起始时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      var checkTimePeriodEndTime = (rule, value, callback) => {
        let mode = this.timePeriodMode;
        if (mode == 2) {
          if (value == 0 || value == '' || value == null) {
            callback(new Error('请输入结束时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      //检查用户限领
      var checkClaimUpperLimit = (rule, value, callback) => {
        let mode = this.userLimitMode;
        if (mode == 2) {
          if (value == 0 || value == '' || value == null) {
            callback(new Error('请设定每人领取上限'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      return {
        formItemWidthMax: '200px', //表单输入宽度
        formItemWidthMin: '150px', //表单输入宽度
        formLabelWidth: '200px', //表单标签宽度
        formPadding: '0 0 0 0',
        formSize: 'medium', //表单大小
        logo: '',
        mName: '',//商户名字
        btnLoading: false, //保存按钮等待
        //图片上传-------------------
        filesData: {
          module: 'image'
        },
        url: uploadUrl + '/user',
        headers: {
          authorized: sessionStorage.token
        },
        //表单
        tips: '',
        couponForm: {
          name: '', //卡券名称
          money: '', //卡券面值
          photoId: '',//图片ID

          validType: 0,//期限模式（0从今日起XX天 1从X月X日到Y月Y日）
          claimedTime: 5,//过期天数
          validTimeStart: '',//固定开始时间
          validTimeEnd: '',//固定过期结束时间

          totalInventory: 0,//库存张数

          actTimeStart: '', //活动开始时间
          actTimeEnd: '', //活动结束时间

          remark: '', //输入卡券说明

          miniExpendLimit: 0, //最低消费金额 0是无门门槛

          useTimeWeek: [], //时间段模式星期
          timePeriodStartTime: '', //开始时间
          timePeriodEndTime: '', //结束时间

          claimUpperLimit: 1,//用户限制数量

          storeIds: '', //使用门店数组

          remindType: '2', //到期前三天提醒模式

          couponSourceType: 1, //同步

          wxColor: 'Color010', //卡券颜色值

          title: '', //卡券标题

          interrupt: 0,
          actStatus: 0,
          changeInventory: 0,


        },

        inventoryMode: 1,//库存模式
        minimumMode: 1, //最低消费模式
        timePeriodMode: 1, //时间段模式
        userLimitMode: 1,//用户限制数量模式
        storeLimitMode: 1,//使用门店限制
        couponColorHex: 'Color010', //卡券颜色值
        timePOption: {
          start: '00:00', step: '00:15', end: '23:59'
        }, //时间段分割
        colorGroup: [
          {value: 'Color010', hex: '#63b359'},
          {value: 'Color020', hex: '#2c9f67'},
          {value: 'Color030', hex: '#509fc9'},
          {value: 'Color040', hex: '#5885cf'},
          {value: 'Color050', hex: '#9062c0'},
          {value: 'Color060', hex: '#d09a45'},
          {value: 'Color070', hex: '#e4b138'},
          {value: 'Color080', hex: '#ee903c'},
          {value: 'Color081', hex: '#f08500'},
          {value: 'Color082', hex: '#a9d92d'},
          {value: 'Color090', hex: '#dd6549'},
          {value: 'Color100', hex: '#cc463d'},
          {value: 'Color101', hex: '#cf3e36'},
          {value: 'Color102', hex: '#5E6671'},
        ],//颜色组
        couponLogoImgUrl: '',
        weekStr: '',
        couponSyncPreview: true, //卡券预览显示

        //选择门店
        couponSelectStoreVisible: false, //卡券选择门店显示
        storeListData: [],//门店原生数据
        storeListDataTotalElement: 0,//门店列表条数
        storeListDataSelect: [],//门店已选择
        searchStoreName: '',//门店搜索关键词
        checkAll: false,//全选

        //表单校验
        rules: {
          name: [
            {required: true, message: '请输入卡券名称', trigger: 'blur'},
            {min: 2, max: 9, message: '长度在 2 到 9 个字符', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          money: [
            {required: true, message: '请输入卡券面值', trigger: 'blur'},
            {validator: checkMoney, trigger: 'blur'}
          ],
          photoId: [
            {required: true, message: '请上传卡券LOGO', trigger: 'change'},
          ],
          claimedTime: [
            {validator: checkClaimedTime, trigger: 'blur'}
          ],
          validTimeStart: [
            {validator: checkValidTimeStart, trigger: 'blur'}
          ],
          validTimeEnd: [
            {validator: checkValidTimeEnd, trigger: 'blur'}
          ],
          totalInventory: [
            {validator: checkTotalInventory, trigger: 'blur'}
          ],
          actTimeStart: [
            {required: true, message: '请选择活动的开始日期', trigger: 'blur'},
            {validator: checkActTimeStart, trigger: 'blur'}
          ],
          actTimeEnd: [
            {required: true, message: '请选择活动的结束日期', trigger: 'blur'},
            {validator: checkActTimeEnd, trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '请输入卡券说明', trigger: 'blur'},
          ],
          miniExpendLimit: [
            {validator: checkMiniExpendLimit, trigger: 'blur'}
          ],
          useTimeWeek: [
            {required: true, message: '请选择星期时段', trigger: 'blur'},
          ],
          timePeriodStartTime: [
            {validator: checkTimePeriodStartTime, trigger: 'blur'}
          ],
          timePeriodEndTime: [
            {validator: checkTimePeriodEndTime, trigger: 'blur'}
          ],
          claimUpperLimit: [
            {validator: checkClaimUpperLimit, trigger: 'blur'}
          ],
          title: [
            {required: true, message: '请输入卡券标题', trigger: 'blur'},
          ],
        },//表单规则
      }
    }
    ,
    props: ['openmode', 'couponid', 'source'],
    watch:
      {
        //监听是否预览卡包
        'couponForm.couponSourceType':
          {
            handler(nv, ov) {
              if (nv == 1) {
                this.couponSyncPreview = true
              } else if (nv == 2) {
                this.couponSyncPreview = false
              }
            }
            ,
            immediate: true,
            // deep: true
          }
        ,
        //监听星期
        'couponForm.useTimeWeek':
          {
            handler(nval, oval) {
              let arr = nval;
              //ES6 排序
              //new set()将arr变为对象，是使用 Array.from变为数组
              var nv = Array.from(new Set(arr)).sort();
              // console.log(nv)
              if (nv.length > 0) {
                let weekStr = '';
                if (nv.length == 7) {
                  this.weekStr = '周一至周日'
                } else {
                  for (let i in nv) {
                    switch (nv[i]) {
                      case '1':
                        weekStr += '周一';
                        weekStr += '，';
                        break;
                      case '2':
                        weekStr += ('周二');
                        weekStr += '，';
                        break;
                      case '3':
                        weekStr += ('周三');
                        weekStr += '，';
                        break;
                      case '4':
                        weekStr += ('周四');
                        weekStr += '，';
                        break;
                      case '5':
                        weekStr += ('周五');
                        weekStr += '，';
                        break;
                      case '6':
                        weekStr += ('周六');
                        weekStr += '，';
                        break;
                      case '7':
                        weekStr += ('周日');
                        break
                    }
                  }
                  this.weekStr = weekStr
                }
              }
            }
            ,
            immediate: true,
          }
        ,

        //时间
        'couponForm.timePeriodEndTime':
          {
            handler(nv, ov) {
              if (nv < this.couponForm.timePeriodStartTime) {
                this.$message.error('结束时间不能早于开始时间');
                this.couponForm.timePeriodEndTime = ''
              } else if (nv == this.couponForm.timePeriodStartTime && this.couponForm.timePeriodStartTime != '') {
                this.$message.error('开始与结束时间不能相同');
                this.couponForm.timePeriodEndTime = ''
              }
            }
            ,
            immediate: true,
          }
        ,

      }
    ,
    mounted() {
      this.getStoreListBySelect(); //获取此商户门店所有列表
      this.logo = sessionStorage.getItem('face') || ''; //获取商户LOGO
      this.mName = sessionStorage.getItem('name') || '商户';

      this.$nextTick(function () {
        this.$refs.couponForm.resetFields()
      });

      // console.log(this.couponid)
      //如果卡券id不为空，则获取卡券详情
      if (this.couponid != '' && this.couponid != null) {
        this.findSignCouponDetail(this.couponid)
      }

    }
    ,
    filters: {
      //过滤器
    }
    ,
    methods: {
      /**
       * 获取卡券详情
       */
      findSignCouponDetail: function (id) {
        findSignCouponDetail(id).then(res => {
          let data = res.obj;
          this.checkCouponReturnDetail(data)
        }).catch(e => {

        })
      }
      ,

      /**
       * 数据核对及回显
       */
      checkCouponReturnDetail: function (data) {
        let original = this.deepCopy(data);
        this.couponForm.name = original.name;
        this.couponForm.money = original.money;
        //卡券LOGO
        this.couponForm.photoId = original.photoId;
        this.couponLogoImgUrl = this.getImg(original.photoId);

        this.couponForm.validType = original.validType;
        if (original.validType == 0) {
          this.couponForm.claimedTime = original.claimedTime
        } else if (original.validType == 1) {
          this.couponForm.validTimeStart = original.validTimeStart;
          this.couponForm.validTimeEnd = original.validTimeEnd
        }

        if (original.totalInventory === 99999999) {
          this.inventoryMode = 1
        } else {
          this.inventoryMode = 2;
          this.couponForm.totalInventory = original.totalInventory
        }

        this.couponForm.actTimeStart = original.actTimeStart;
        this.couponForm.actTimeEnd = original.actTimeEnd;

        this.couponForm.remark = original.remark;

        if (original.miniExpendLimit == 0) {
          this.minimumMode = 1
        } else {
          this.minimumMode = 2;
          this.couponForm.miniExpendLimit = original.miniExpendLimit
        }

        if (original.useTimeWeek == '1,2,3,4,5,6,7' && original.useTimeDay == '00:00-23:59') {
          this.timePeriodMode = 1
        } else {
          this.timePeriodMode = 2;
          this.couponForm.useTimeWeek = original.useTimeWeek.split(',');
          if (original.useTimeDay != null) {
            this.couponForm.timePeriodStartTime = original.useTimeDay.split('-')[0];
            this.couponForm.timePeriodEndTime = original.useTimeDay.split('-')[1]
          } else {
            this.couponForm.timePeriodStartTime = '00:00';
            this.couponForm.timePeriodEndTime = '23:59'
          }
        }

        if (original.storeIds != '') {
          let tmpArr = original.storeIds.split(',');
          if (tmpArr.length == this.storeListData.length) {
            this.storeLimitMode = 1;
            this.storeListDataSelect = tmpArr
          } else {
            this.storeLimitMode = 2;
            this.storeListDataSelect = tmpArr
          }
        }

        if (original.claimUpperLimit == 99999999) {
          this.userLimitMode = 1
        } else {
          this.userLimitMode = 2;
          this.couponForm.claimUpperLimit = original.claimUpperLimit
        }

        this.couponForm.remindType = original.remindType;

        this.couponForm.couponSourceType = original.couponSourceType;

        this.couponForm.wxColor = original.wxColor;
        for (let i in this.colorGroup) {
          if (this.colorGroup[i].value == original.wxColor) {
            this.couponColorHex = this.colorGroup[i].hex
          }
        }

        this.couponForm.title = original.title

      }
      ,

      /**
       *全选
       */
      handleCheckAllChange: function () {
        if (this.checkAll) {
          let data = this.storeListData;
          let tmp = [];
          for (let i in data) {
            tmp.push(data[i].id)
          }
          this.storeListDataSelect = tmp
        } else {
          this.storeListDataSelect = []
        }

      }
      ,

      /**
       *检查是否全选
       */
      handleCheckedCitiesChange: function () {
        if (this.storeListData.length != this.storeListDataSelect.length) {
          this.checkAll = false
        } else {
          this.checkAll = true
        }
      }
      ,

      /**
       * 颜色选择
       */
      selectColor: function (val, hex) {
        // 赋值的是名称
        if (val != '') {
          this.couponForm.wxColor = val;
          this.couponColorHex = hex
        }
      }
      ,
      /**
       * 门店选择模态框 打开
       */
      couponSelectStoreOpen: function () {
        this.getStoreListBySelect();
        this.handleCheckedCitiesChange(); //检查全选状态
        this.couponSelectStoreVisible = true
      }
      ,

      /**
       * 获取列表
       */
      getStoreListBySelect: function () {
        let name = this.searchStoreName || '';
        findStoreList(name).then(res => {
          let data = res.obj;
          this.storeListData = data.content
        }).catch(e => {

        })
      }
      ,
      /**
       * 门店选择模态框 取消（清空选项）
       */
      couponSelectStoreCancel: function () {
        this.couponForm.storeIds = '';
        this.storeListDataSelect = [];
        this.couponSelectStoreClose()
      }
      ,
      /**
       * 门店选择模态框 关闭
       */
      couponSelectStoreClose: function () {
        this.couponSelectStoreVisible = false
      }
      ,

      /**
       * 保存门店选项
       */
      couponSelectStoreSave: function () {
        // console.log(this.storeListDataSelect)
        this.$set(this.couponForm, 'storeIds', this.storeListDataSelect.join(','));
        this.couponSelectStoreClose()
      }
      ,

      /**
       * 检查名称
       */
      /*
      checkName: function () {
        let name = this.couponForm.name;
        let lastName = name;
        if (name != '') {
          checkCouponName(name).then(res => {
            if (res.msg == '卡券名称已使用') {
              this.$message.error('卡券名称已被使用');
              //表单置空
              this.couponForm.name = '';
              //旧名提醒
              this.tips = lastName + ' 已经被使用，请更换一个。'
            } else {
              //可用的话则取消提示
              this.tips = ''
            }
          }).catch(e => {

          })
        }
      },
      */



      /**
       * 表单验证
       */
      rulesFormCheck: function () {
        this.$refs.couponForm.validate((valid) => {
          if (valid) {
            this.couponDataCheck()
          } else {
            console.log('error submit!!');
            return false
          }
        })
      }
      ,

      /**
       * 新建卡券 数据格式化
       */
      couponDataCheck: function () {
        let form = this.couponForm;
        let data = this.deepCopy(form); //深拷贝，以防污染原数据

        //商户名
        data.merchantName = sessionStorage.getItem('name');

        //库存模式，如果库存模式为无限制，则设置totalInventory为99999999
        if (this.inventoryMode == 1) {
          data.totalInventory = 99999999
        }
        //最低消费模式，如果模式为无门槛，miniExpendLimit为0
        if (this.minimumMode == 1) {
          data.miniExpendLimit = 0
        }

        //如果没有使用时段限制，则固定两个参数写法
        if (this.timePeriodMode == 1) {
          data.useTimeDay = '00:00-23:59';
          data.useTimeWeek = '1,2,3,4,5,6,7'
        } else {
          data.useTimeDay = (data.timePeriodStartTime || '00:00') + '-' + (data.timePeriodEndTime || '23:59');
          data.useTimeWeek = data.useTimeWeek.join(',')
        }

        //库存模式，如果库存模式为无限制，则设置totalInventory为99999999
        if (this.userLimitMode == 1) {
          data.claimUpperLimit = 99999999
        }

        //使用门店限制
        if (this.storeLimitMode == 1) {
          if (this.storeListData != []) {
            let arr = this.storeListData;
            let tmp = [];
            for (let i in arr) {
              tmp.push(arr[i].id)
            }
            this.storeListDataSelect = tmp;
            data.storeIds = tmp.join(',')
            // console.log(data.storeIds)
          }
        } else if (this.storeLimitMode == 2) {
          let tmp = this.storeListDataSelect;
          data.storeIds = tmp.join(',')
          // console.log(data.storeIds)
        }

        //门店选择判断
        if (data.storeIds == '') {
          this.$message.error('还未选择门店');
          return
        }

        //创建类型判断 组件openmode
        if (this.openmode == 1) {
          this.submitCoupon(data)  //自由创建模式
        } else if (this.openmode == 2) {
          data.cardType = 2;
          this.submitCouponByType(data) //绑卡模式
        } else if (this.openmode == 3) {
          data.cardType = 3;
          this.submitCouponByStored(data)  //储值规则模式
        } else {
          this.$message.error('本页参数非法，请关闭此页后再次进入');

        }

      }
      ,

      /**
       * 确认新建卡券  自由创建模式
       */
      submitCoupon: function (data) {
        this.btnLoading = true; //锁定按钮
        saveCoupon(data).then(res => {
          this.$message.success(res.msg);
          this.closeCouponBySaveSuccess() //保存成功后关闭
        }).catch(e => {
          this.btnLoading = false //错误则解锁
        })

      }
      ,
      /**
       * 确认新建卡券  绑定会员卡模式
       */
      submitCouponByType: function (data) {
        this.btnLoading = true; //锁定按钮
        saveCouponByType(data).then(res => {
          this.$message.success(res.msg);
          this.closeCouponBySaveSuccess() //保存成功后关闭
        }).catch(e => {
          this.btnLoading = false //错误则解锁
        })
      }
      ,
      /**
       * 确认新建卡券  绑定储值规则模式
       */
      submitCouponByStored: function (data) {
        //saveCouponByType
        this.btnLoading = true; //锁定按钮
        saveCouponByType(data).then(res => {
          this.$message.success(res.msg);
          let data = res.obj;
          this.closeCouponBySaveSuccess(data) //保存成功后关闭,并发送id
        }).catch(e => {
          this.btnLoading = false //错误则解锁
        })
        // 如果是从模态框打开的组件，则保存后关闭模态框
      }
      ,

      /**
       * 关闭组件[保存成功]（only Dialog）
       */
      closeCouponBySaveSuccess: function (saveid = '') {
        let data = this.openmode;
        if (data == 1) {
          this.$router.push({path: '/member/views/couponMarketing'}) //直接跳转
        } else if (data == 2) {
          // 需要name
          this.$emit('closefatherdialogbysavesuccess', {name: this.couponForm.name})
        } else if (data == 3) {
          //需要传id和name
          this.$emit('closefatherdialogbysavesuccess', {saveid: saveid, name: this.couponForm.name})
        }
      }
      ,

      /**
       * 关闭组件
       */
      closeCoupon: function () {
        //如果是模态框打开的组件，则关闭父模态框
        //父组件不同，结果不同
        // console.log(this.openmode)
        let data = this.openmode;
        if (data == 1) {
          this.$router.push({path: '/member/views/couponMarketing'})
        } else if (data == 2) {
          this.$emit('closefatherdialog')
        } else if (data == 3) {
          this.$emit('closefatherdialog')
        }
      }
      ,

      /**
       * 取消创建
       */
      cancelCreate: function () {
        this.$confirm('卡券还未保存，是否关闭?', '提示', {
          confirmButtonText: '关闭',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.closeCoupon()
        }).catch(() => {

        })
      }
      ,

      /**
       logo上传
       **/
      uploadLogoImg(response, file) {
        //保存图片ID
        // console.log(response)
        this.$message({
          message: '图片上传成功！',
          type: 'success'
        });
        this.couponForm.photoId = response.obj;
        this.couponLogoImgUrl = returnThumbnailUrl(response.obj)
      }
      ,

      /**
       上传失败
       **/
      handleImageFailed() {
        this.$message({
          message: '图片上传失败',
          type: 'error'
        })
      }
      ,
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
      }
      ,

      /**
       * ********************************预览窗拖拽******************************************
       */
      closeDialog(e) {
        this.couponSyncPreview = false
        // alert(this.dialogVisible)
        // this.$store.commit('newDialogVisible', false)
      }
      ,
      mousedown(event) {
        // console.log(event)
        this.selectElement = document.getElementById('wx-app');
        var div1 = this.selectElement;
        this.selectElement.style.cursor = 'move';
        this.isDowm = true;
        var distanceX = event.clientX - this.selectElement.offsetLeft;
        var distanceY = event.clientY - this.selectElement.offsetTop;
        // alert(distanceX)
        // alert(distanceY)
        // console.log(distanceX)
        // console.log(distanceY)
        document.onmousemove = function (ev) {
          var oevent = ev || event;
          div1.style.left = oevent.clientX - distanceX + 'px';
          div1.style.top = oevent.clientY - distanceY + 'px'
        };
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
          div1.style.cursor = 'default'
        }
      }
      ,
      /**
       * ********************************工具方法******************************************
       */

      /**
       * 深拷贝对象
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
      }
      ,
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
      }
      ,

    }
  }
</script>

<style scoped>

  /*public 公用样式*/
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .width100 {
    width: 100px;
  }

  .width190 {
    width: 190px;
  }

  .width200 {
    width: 200px;
  }

  .no-margin-right {
    margin-right: 0 !important;
  }

  .public-width {
    width: 100%;
    overflow: hidden;
  }

  .formItemWidthMin {
    width: 150px;
  }

  .formItemWidthMax {
    width: 200px;
  }

  .formLabelWidth {
    width: 200px;
  }

  .formPadding {
    padding: 0 0 0 0;
  }

  .formPadding10 {
    padding: 0 0 0 10px;
  }


  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    margin-bottom: 20px;
  }

  /*form 表单用样式*/
  .unit-txt {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #808080;
    padding: 0 0 0 10px;
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

  /*颜色选项*/

  .color-group {
    width: 360px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }

  .el-color-picker {
    /*偏移一些*/
    margin-right: 10px;
  }

  .el-color-picker__icon {
    /*以防看不见，加点阴影*/
    color: white;
    text-shadow: 1px 1px 3px #808080;
  }

  /*按钮*/
  .btn-group {
    margin: 0 auto;
    text-align: center;
  }

  /*模态框*/
  .defaultPosition {
    position: fixed;
    right: 0;

  }

  ::-webkit-scrollbar {
    display: none;
  }


  /*模拟微信*/
  .sim-wxapp {
    z-index: 2000;
    cursor: default;
    position: fixed;
    right: 10px;
    top: 200px;
    width: 320px;
    height: 560px;
    background-color: #f3f3f3;
    box-shadow: 0 2px 15px 1px #cecece;
  }

  .sim-wxapp-header {
    cursor: move;
    background-color: #e4e4e4;
    font-style: unset;
    padding: 0 0 0 10px;
    height: 30px;
    width: 100%;
  }

  .dialog-title {
    line-height: 30px;
    font-size: 13px;
    color: #262626;
  }

  .pa-title {
    line-height: 30px;
    font-size: 13px;
    color: #2a2a2a;
  }

  .close-icon {
    cursor: default;
    line-height: 30px;
    padding: 0 10px 0 0;
  }

  /*虚拟界面*/
  .sim-body {
    background-color: #63b359;
    width: 320px;
    height: 560px;
  }

  .sim-logo {
    background-color: white;
    border: 1px solid #ccc;
    position: relative;
    left: 138px;
    border-radius: 50px;
    height: 50px;
    width: 50px;
  }

  .roof-img {
    background: url('../../assets/images/member/head_bar.png') no-repeat;
    background-size: 100% 100%;
    margin-right: 5px;
    height: 55px;
    width: 320px;
  }

  .sim-info-panel {
    width: 280px;
    height: 300px;
    background: #FFF;
    border-radius: 5px;
    margin-left: 20px;
    margin-top: -26px;
  }

  .info-panel-content {
    text-align: center;
    padding-top: 38px;
  }

  .brand-name {
    color: #999;
    font-size: 14px;
  }

  .brand-title {
    font-size: 16px;
    color: #333;
  }

  .brand-button {
    cursor: pointer;
    border-radius: 5px;
    font-size: 14px;
    color: #fff;
    padding: 5px;
    width: 120px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }

  .button-color {
    background: #2c9f67;
    border: solid 1px #999;
  }

  .sim-body-time {
    height: 70px;
    margin-top: 55px;
    padding-left: 13px;
    border-bottom: 1px dashed #999;
    font-size: 13px;
  }

  .time-left {
    width: 75px;
    float: left;
  }

  .time-right {
    color: #999;
    width: 190px;
    float: right;
  }

  .wx-pa {
    color: black;
    font-style: normal;
    padding: 14px 10px;
    height: 50px;
  }
  .store-list-box{
    height: 200px;
    overflow-y: scroll;
  }

  .store-list {
    width: 100%;
  }

  .table-box {
    height: 300px;
  }

  .store-list thead tr td:nth-child(1) {
    width: 50px;
  }

  .store-list thead tr td:nth-child(2) {
    width: 50%;
  }

  .store-list thead tr td:nth-child(3) {
    width: 50%;
  }

  .store-list tbody tr {
    height: 30px;
  }

  .store-list tbody tr td {
    color: #808080;
    text-align: center;
  }

  .tips {
    font-size: 13px;
    color: #99a9bf;
    margin-left: 10px;
  }
</style>
