<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">

      <!--内容-->

      <el-tabs v-model="tabsName" @tab-click="changeTabs">
        <el-tab-pane label="会员列表" name="1">
          <!--会员列表-->
          <div class="tab_header_bar">
            <div class="block">
              <el-input size="medium" v-model="searchForm.phone" placeholder="手机号"></el-input>
            </div>
            <div class="block">
              <el-input size="medium" v-model="searchForm.memberNum" placeholder="会员卡号"></el-input>
            </div>
            <div class="block">
              <el-date-picker
                v-model="searchForm.startTime"
                type="date"
                size="medium"
                placeholder="开始日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                style="width: 190px">
              </el-date-picker>
              至
              <el-date-picker
                v-model="searchForm.endTime"
                type="date"
                size="medium"
                placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                style="width: 190px">
              </el-date-picker>
            </div>
            <div class="block" style="margin-left: 10px">
              <el-button size="medium" type="primary" @click="submitSearchByList">查 询</el-button>
              <el-button size="medium" type="" @click="reset">重 置</el-button>
              <el-button size="medium" type="" @click="memberExport">导 出</el-button>
              <el-button size="medium" type="" @click="downloadTemp">导入模板</el-button>
              <el-upload
                style="display: inline-block;margin:0 10px"
                class="upload-demo"
                :headers="headers"
                :action="importUrl"
                :on-success="importSuccess"
                :before-upload="beforeExcelUpload"
                :show-file-list="false">
                <el-button size="medium" type="">导 入</el-button>
              </el-upload>
              <el-button size="medium" type="" @click="msgPushOpen">消息推送管理</el-button>
              <!--<el-button size="medium" type="">会员H5链接</el-button>-->
            </div>
          </div>
          <div class="tab_bottom">
            <!--表格-->
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                type='index'
                label="序号"
                width="60">
              </el-table-column>
              <el-table-column
                label="卡号"
                width="180">
                <template slot-scope="scope">
                  <el-button type="text" @click="goDetail(scope.row)">{{scope.row.memberNum}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="nickname"
                label="名称"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                prop="phone"
                label="电话"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                prop="balance"
                label="余额"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                prop="scores"
                label="可用积分"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                prop="lastPayDate"
                label="上次消费"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                label="操作"
                width="350px">
                <template slot-scope="scope">
                  <!--<el-button size="mini" type="primary" @click="chargeOpen(scope.row.id)">充值</el-button>-->
                  <el-button type="primary" @click="goDetail(scope.row)" size="mini">详 情</el-button>
                  <el-button @click="editMemberOpen(scope.row)" size="mini">编 辑</el-button>
                  <el-button size="mini" @click="maintenanceOpen(scope.row)">保养提醒设置</el-button>
                  <!--<el-button @click="deleteMemberOpen(scope.row)" size="mini">删 除(未开放)</el-button>-->
                </template>
              </el-table-column>
            </el-table>

            <pagination
              :total-elements="tableTotalElement"
              :change-callback="getMemberListByList"
              ref="page"></pagination>

          </div>
        </el-tab-pane>
        <!--************************************-->
        <el-tab-pane label="会员分析" name="2">
          <!--会员分析-->
          <div class="tab_header_bar">
            <div class="block">
              <el-radio-group v-model="dayRange" size="medium" @change="changeDays">
                <el-radio-button label="0">今日</el-radio-button>
                <el-radio-button label="1">昨日</el-radio-button>
                <el-radio-button label="2">近7日</el-radio-button>
                <el-radio-button label="3">近1月</el-radio-button>
              </el-radio-group>
            </div>

            <div class="block">
              <el-date-picker
                v-model="analysisSearchForm.startTime"
                type="date"
                size="medium"
                placeholder="开始日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                style="width: 190px">
              </el-date-picker>
              至
              <el-date-picker
                v-model="analysisSearchForm.endTime"
                type="date"
                size="medium"
                placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                style="width: 190px">
              </el-date-picker>
            </div>

            <div class="block" style="margin-left: 10px">
              <el-button size="medium" type="primary" @click="submitSearchByAnalysis">查 询</el-button>
              <el-button size="medium" type="" @click="resetAnalysis">重 置</el-button>
            </div>
          </div>

          <!--卡片-->
          <div class="card_group">

            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/add.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>新增会员
                      <el-tooltip class="item" effect="light" content="新增会员的数量。" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>{{analysisCardData.newMember}}</p>
                  </div>
                </div>
              </el-card>
            </div>

            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/total.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>会员总量
                      <el-tooltip class="item" effect="light" content="会员的总数量" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>{{analysisCardData.allMember}}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <!--图表 ·1-->
          <el-card class="box-card">
            <el-tabs v-model="lineOneChartTab" @tab-click="lineOneChartChange">
              <el-tab-pane label="按时间" name="1">
                <div id="lineOne1" class="chart_img"
                     v-loading="lineOneDataNull"
                     element-loading-text="没有数据"
                     element-loading-spinner="el-icon-view"
                     element-loading-background="rgba(255, 255, 255, 1)">
                </div>
              </el-tab-pane>
              <!--<el-tab-pane label="按门店" name="2">-->
              <!--<div id="lineOne2" class="chart_img"-->
              <!--v-loading="lineOneDataNull"-->
              <!--element-loading-text="没有数据"-->
              <!--element-loading-spinner="el-icon-view"-->
              <!--element-loading-background="rgba(255, 255, 255, 1)">-->
              <!--</div>-->
              <!--</el-tab-pane>-->
              <el-tab-pane label="按渠道" name="3">
                <div id="lineOne3" class="chart_img"
                     v-loading="lineOneDataNull"
                     element-loading-text="没有数据"
                     element-loading-spinner="el-icon-view"
                     element-loading-background="rgba(255, 255, 255, 1)">
                </div>
              </el-tab-pane>
              <el-tab-pane label="按性别" name="4">
                <!--男女比例条-->
                <div class="gender_bar_box">
                  <div class="gender_bar_item">
                    <div class="bar_title">
                      <p>新增会员</p>
                    </div>
                    <div class="bar_content">
                      <div class="bar_icon_group">
                        <div class="bar_icon">
                          <div class="icon_img">
                            <img src="../../../assets/images/member/girl.png" alt="">
                          </div>
                          <div>
                            <p>
                              {{genderProportion.nGp*100}}%</p>
                            <p>{{genderProportion.newMemberGirl}}人</p>
                          </div>
                        </div>
                        <div class="bar_icon">
                          <div class="icon_img">
                            <img src="../../../assets/images/member/boy.png" alt="">
                          </div>
                          <div>
                            <p>{{genderProportion.nGp==0?0:(100-(genderProportion.nGp*100))}}%</p>
                            <p>{{genderProportion.newMemberBoy}}人</p>
                          </div>
                        </div>
                      </div>

                      <div class="bar_proportion">
                        <div class="girl_mark"
                             :style="{width: (genderProportion.nGp*100)+'%' }"></div>
                        <div :class="{nodata:(genderProportion.nGp==0 && genderProportion.nBp==0)}"></div>
                      </div>


                    </div>

                  </div>
                  <div class="gender_bar_item" style="margin-top: 40px">
                    <div class="bar_title">
                      <p>会员总量</p>
                    </div>
                    <div class="bar_content">
                      <div class="bar_icon_group">
                        <div class="bar_icon">
                          <div class="icon_img">
                            <img src="../../../assets/images/member/girl.png" alt="">
                          </div>
                          <div>
                            <p>
                              {{genderProportion.tGp*100}}%</p>
                            <p>{{genderProportion.totalMemberGirl}}人</p>
                          </div>
                        </div>
                        <div class="bar_icon">
                          <div class="icon_img">
                            <img src="../../../assets/images/member/boy.png" alt="">
                          </div>
                          <div>
                            <p>
                              {{genderProportion.tGp==0?0:(100-(genderProportion.tGp*100))}}%</p>
                            <p>{{genderProportion.totalMemberBoy}}人</p>
                          </div>
                        </div>
                      </div>

                      <div class="bar_proportion">
                        <div class="girl_mark"
                             :style="{ width: genderProportion.tGp*100+'%'}"></div>
                        <div :class="{nodata:(genderProportion.tBp==0 && genderProportion.tGp==0)}"></div>
                      </div>


                    </div>

                  </div>
                </div>

              </el-tab-pane>
            </el-tabs>
          </el-card>

          <!--图表 ·2-->
          <el-card class="box-card" style="margin-top: 20px">
            <div slot="header" class="clearfix">
              <span>会员活跃分析</span>
            </div>
            <div class="analysisBox">
              <div id="lineTwo1" class="lineTwo_chart_img"
                   v-loading="lineTwoDataNull"
                   element-loading-text="没有数据"
                   element-loading-spinner="el-icon-view"
                   element-loading-background="rgba(255, 255, 255, 1)">
              </div>
              <div class="lineTwo_chart_img lineTwo_chart_text ">
                <table class="analysis_table">
                  <thead>
                  <tr>
                    <th width="120px">会员活跃占比</th>
                    <th width="120px">人数</th>
                    <th width="120px">百分比</th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-for="item in activityData">
                    <tr>
                      <td>{{item.name}}</td>
                      <td>{{item.value}}人</td>
                      <td v-if="activityDataTotal==0">无法统计</td>
                      <td v-else>{{((item.value/activityDataTotal)*100).toFixed(2)}}%</td>
                    </tr>
                  </template>
                  <!--表格内容-->
                  </tbody>
                </table>
              </div>
            </div>

          </el-card>


        </el-tab-pane>
      </el-tabs>


    </el-card>

    <!--编辑会员-->
    <el-dialog
      title="编辑会员"
      :visible.sync="editMemberDialogVisible"
      width="576px"
      :before-close="editMemberClose">
      <!--***-->
      <el-form :model="editForm" :rules="editMemberRules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" readonly disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="editForm.sex" label="2">女</el-radio>
          <el-radio v-model="editForm.sex" label="1">男</el-radio>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            size="medium"
            placeholder="选择生日"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <!--***-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editMemberClose">取 消</el-button>
    <el-button type="primary" @click="editMemberSubmit" v-loading="btnLoading" :disabled="btnLoading">保 存</el-button>
  </span>
    </el-dialog>

    <!--充值-->
    <el-dialog
      title="充值"
      :visible.sync="chargeVisible"
      :close-on-click-modal="false"
      width="480px"
      :before-close="chargeClose">
      <div>
        <el-form label-width="140px" label-suffix="：" :model="chargeForm" ref="chargeForm">
          <el-form-item label="充值金额">
            <el-input-number v-model="chargeForm.money" :min="0.00" :step="10" :precision="2"
                             :max="999999999"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="chargeClose">取 消</el-button>
    <el-button type="primary" @click="confirmCharge">确 定</el-button>
  </span>
    </el-dialog>

    <!--保养提醒-->
    <el-dialog
      title="保养提醒设置"
      :visible.sync="maintenanceVisible"
      width="576px"
      :before-close="maintenanceClose">
      <div>
        <el-form :model="maintenanceForm" ref="maintenanceForm"
                 label-suffix="：" label-width="120px">

          <el-form-item label="是否开启提醒">
            <el-switch
              v-model="maintenanceForm.code"
              active-color="#13ce66"
              active-text="开启"
              :active-value="1"
              inactive-color="#ff4949"
              inactive-text="关闭"
              :inactive-value="2">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <template v-for="(item,index) in maintenanceForm.good">
              <el-form-item label="商品" label-width="90px"
                            :prop="`good.${index}.luxuryId`" style="margin-bottom: 5px">
                <el-select
                  v-model="item.luxuryId"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="getGoodOptionRemote">
                  <el-option
                    v-for="item in goodOption"
                    :key="item.id"
                    :label="item.luxuryName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="保养时间" label-width="90px" :prop="`good.${index}.remindTime`"
                            style="margin-bottom: 5px">
                <el-date-picker
                  v-model="item.remindTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="选择提醒日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="提前时长" label-width="90px" :prop="`good.${index}.number`" style="margin-bottom: 5px">
                <el-input-number v-model="item.number" :min="0" :max="72" :precision="0" :step="1"></el-input-number>
                <span>&nbsp小时</span>
              </el-form-item>
              <el-divider></el-divider>
            </template>
          </el-form-item>


        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="maintenanceClose">取 消</el-button>
    <el-button type="primary" @click="submitMaintenance" :loading="btnLoading">确 定</el-button>
  </span>
    </el-dialog>

    <!--推送管理-->
    <el-dialog
      title="推送管理"
      :visible.sync="msgPushVisible"
      :close-on-click-modal="false"
      width="576px"
      :before-close="msgPushClose">
      <div>
        <el-form :model="msgPushForm" :rules="msgPushFormRules" ref="msgPushForm"
                 label-width="120px" label-suffix="：">

          <el-form-item label="是否开启提醒" prop="codeSwitch">
            <el-switch
              v-model="msgPushForm.codeSwitch"
              active-color="#13ce66"
              active-text="开启"
              :active-value="1"
              inactive-color="#ff4949"
              inactive-text="关闭"
              :inactive-value="2">
            </el-switch>
          </el-form-item>

          <!--<el-form-item label="通知渠道">-->
          <!--<el-checkbox-group v-model="msgPushForm.msgChannel">-->
          <!--<el-checkbox label="msg">短信</el-checkbox>-->
          <!--<el-checkbox label="wechat">微信消息</el-checkbox>-->
          <!--</el-checkbox-group>-->
          <!--</el-form-item>-->
          <el-form-item label="主扫信息内容" prop="message">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="主扫信息内容"
              v-model="msgPushForm.message">
            </el-input>
          </el-form-item>

          <el-form-item label="模板ID" prop="message">
            <el-input placeholder="输入可用的模板id" v-model.trim="msgPushForm.templateId">
            </el-input>
          </el-form-item>

          <el-form-item label="被扫邀请领卡" prop="codeSwitch2">
            <el-switch
              v-model="msgPushForm.codeSwitch2"
              active-color="#13ce66"
              active-text="开启"
              :active-value="1"
              inactive-color="#ff4949"
              inactive-text="关闭"
              :inactive-value="2">
            </el-switch>
          </el-form-item>


        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="msgPushClose">取 消</el-button>
    <el-button type="primary" @click="messageConfigSubmitBefore">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {url} from '@/utils/request'
  import {
    findMemberList,
    editMember,
    findAnalyseCard,
    findAnalyseByChannel,
    findAnalyseByTime,
    findAnalyseBySex,
    findAnalyseByActivity,
    findMaintenanceGoods,
    saveMaintenanceGoods,
    findMaintenanceConfig,
    findMessageConfig,
    saveMessageConfig,
    modifyMessageConfig
  } from '../api/member'

  export default {
    name: 'memberList',
    components: {pagination},
    data() {
      return {
        loading: false,//页面加载
        btnLoading: false, //按钮锁定
        tabsName: '1',//标签页
        importUrl: url + '/member/member/member_import',
        headers: {
          authorized: sessionStorage.token
        },
        searchForm: {
          memberNum: '',
          startTime: '',
          endTime: '',
          phone: ''
        },//搜索条件
        tableData: [],//表格数据
        tableTotalElement: 0,//表格总条数

        //模态框
        editMemberDialogVisible: false,//编辑模态框
        editForm: {
          id: '',
          nickname: '',
          phone: '',
          sex: '',
          birthday: ''
        },
        editMemberRules: {
          nickname: [
            {required: true, message: '请输入完整姓名', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 2 到 12 个字符', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '必须选择性别', trigger: 'blur'},
          ],
        },//编辑表单验证

        //**********************************************
        dayRange: '0',//日期范围
        analysisSearchForm: {
          startTime: '',
          endTime: ''
        }, //会员分析搜索条件
        analysisCardData: {
          allMember: 0,
          newMember: 0
        },
        genderProportion: {
          newMemberTotal: 0,
          newMemberGirl: 0,
          newMemberBoy: 0,
          nBp: 0,
          nGp: 0,
          totalMemberTotal: 0,
          totalMemberGirl: 0,
          totalMemberBoy: 0,
          tBp: 0,
          tGp: 0,
        },
        lineOneChartTab: '1',
        lineOneDataNull: true,//上图表无数据
        lineTwoDataNull: true,//下图表无数据

        //会员活跃度分析
        activityData: [
          {name: '暂无数据', num: '暂无数据'}
        ],//下图表数据
        activityDataTotal: 0,

        //充值
        chargeVisible: false,
        chargeForm: {
          id: '',
          money: 0,
        },
        //----------------------------保养提醒---------------------------
        maintenanceVisible: false,
        currentId: '',
        goodOption: [],
        maintenanceForm: {
          code: 2,
          good: [
            {luxuryId: '', number: 24, remindTime: ''}
          ]
        },

        //----------------------------消息推送---------------------------
        msgPushVisible: false,
        msgPushForm: {
          id: '',
          merchantId: '',
          codeSwitch: 2,
          codeSwitch2: 2,
          templateId: '',
          message: '',
        },

        msgPushFormRules: {
          codeSwitch: [
            {required: true, message: '必须选择状态', trigger: 'change'}
          ],
          codeSwitch2: [
            {required: true, message: '必须选择状态', trigger: 'change'}
          ],
          message: [
            {required: false, message: '必须输入模板', trigger: 'blur'}
          ],
          templateId: [
            {required: true, message: '必须输入模板ID', trigger: 'blur'}
          ]
        },

      }
    },
    watch: {
      'maintenanceForm.good': {
        handler(newData, oldData) {
          if (newData && newData.length < 5) {
            if (newData[newData.length - 1].luxuryId) {
              this.maintenanceForm.good.push({luxuryId: '', number: 24, remindTime: ''})
            }
          }


        },
        deep: true,
        immediate: true
      }
    },
    mounted() {
      //预载操作
      this.changeDays(); //设置默认日期
      this.getMemberListByList(1, 10)
    },
    filters: {},
    methods: {
      //----------------------------消息推送---------------------------
      msgPushClose: function () {
        this.$refs['msgPushForm'].resetFields()
        this.msgPushVisible = false;
      },

      msgPushOpen: function () {
        this.msgPushVisible = true;

        setTimeout(() => {
          this.findMessageConfig()
        }, 100)

      },

      findMessageConfig: function () {
        let id = sessionStorage.merchantId
        findMessageConfig(id).then(res => {
          let data = res.obj
          this.msgPushForm.codeSwitch = data.codeSwitch
          this.msgPushForm.codeSwitch2 = data.codeSwitch2
          this.msgPushForm.templateId = data.templateId
          this.msgPushForm.message = data.message
          this.msgPushForm.id = data.id
          this.msgPushForm.merchantId = data.merchantId
        }).catch(e => {

        })
      },

      messageConfigSubmitBefore: function () {

        let form = this.msgPushForm
        form.merchantId = sessionStorage.merchantId

        this.$refs['msgPushForm'].validate((valid) => {
          if (valid) {

            if (form.id === '' || form.id === null || form.id == 0) {
              delete form.id
              this.messageConfigSubmitSave(form)
            } else {
              this.messageConfigSubmitModify(form)
            }


          } else {
            this.$message.error(`还有未正确填写的内容。`)
            return false;
          }
        });
      },
      //保存
      messageConfigSubmitSave: function (form) {
        this.btnLoading = true
        saveMessageConfig(form).then(res => {
          this.$message.success(`${res.msg}`)
          this.msgPushClose()
          setTimeout(() => {
            this.btnLoading = false
          })
        }).catch(e => {
          this.btnLoading = false
        })
      },
      //修改
      messageConfigSubmitModify: function (form) {
        this.btnLoading = true
        modifyMessageConfig(form).then(res => {
          this.$message.success(`${res.msg}`)
          this.msgPushClose()
          setTimeout(() => {
            this.btnLoading = false
          })
        }).catch(e => {
          this.btnLoading = false
        })
      },


      //----------------------------保养提醒---------------------------

      maintenanceClose: function () {
        this.maintenanceForm = {
          code: 2,
          good: [
            {luxuryId: '', number: 24, remindTime: ''}
          ]
        };
        this.maintenanceVisible = false;
      },

      maintenanceOpen: function (data) {
        this.getGoodOption();
        this.currentId = data.id;
        this.findMaintenanceConfig();
        this.maintenanceVisible = true;

      },

      //返回配置
      findMaintenanceConfig: function () {
        let id = this.currentId;
        findMaintenanceConfig(id).then(res => {
          let data = res.obj;
          this.maintenanceForm.code = data.switch.status || 2;


          if (data.settings.length > 0) {
            let arr = [];
            console.log(data.settings);
            data.settings.forEach(item => {
              console.log(item)
              arr.push({
                luxuryId: item.luxuryId,
                number: item.number,
                remindTime: item.remindTime
              })
            });
            this.$set(this.maintenanceForm, 'good', arr)
          }

        }).catch(e => {

        })
      },

      getGoodOption: function () {
        findMaintenanceGoods().then(res => {
          this.goodOption = res.obj
        }).catch(e => {

        })
      },
      getGoodOptionRemote: function (key) {
        if (key !== '') {
          findMaintenanceGoods().then(res => {
            let data = res.obj;
            let newData = data.filter(item => {
              return item.luxuryName.toLowerCase()
                .indexOf(key.toLowerCase()) > -1;
            });
            this.goodOption = newData
          }).catch(e => {

          })
        } else {
          this.getGoodOption()
        }
      },

      submitMaintenance: function () {
        let form = {};
        form.memberId = this.currentId;

        let configArr = this.maintenanceForm.good;
        let beforeArr = [];
        let JSONArr = [];
        if (configArr) {
          configArr.forEach(item => {
            if (item.luxuryId && item.remindTime) {
              item.memberId = this.currentId;
              item.merchantId = sessionStorage.merchantId;
              beforeArr.push(item)
            }
          });
          JSONArr = JSON.stringify(beforeArr)
        }

        form.json = JSONArr;
        form.code = this.maintenanceForm.code;

        console.log(form);
        this.btnLoading = true

        saveMaintenanceGoods(form).then(res => {
          this.$message.success(res.msg)
          this.maintenanceClose()
          setTimeout(() => {
            this.btnLoading = false
          }, 500)
        }).catch(e => {
          this.btnLoading = false
        })


      },

      /**
       * 前往详情
       */
      goDetail: function (data) {
        let id = data.id;
        let wall = data.balance;
        let sc = data.scores;
        if (id === '' || id == null || id == undefined) {
          this.$message.error('没有卡号')
        } else {
          this.$router.push({path: '/member/views/memberDetail', query: {id: id, w: wall, sc: sc}})
        }
      },

      /**
       * 切换标签页
       */
      changeTabs: function (tab, event) {

        //切换标签 获取标签2 会员分析的数据
        if (this.tabsName == '2') {
          this.submitSearchByAnalysis()
        }
      },

      /**
       * 会员列表提交搜索
       */

      submitSearchByList: function () {
        this.getMemberListByList(1, 10)
      },

      /**
       * 获取会员列表
       */
      getMemberListByList: function (number, pageSize) {
        this.loading = true;
        findMemberList(number, pageSize, this.searchForm.memberNum, this.searchForm.phone, this.searchForm.startTime, this.searchForm.endTime).then(response => {
          let data = response.obj;
          console.log(data);
          this.tableTotalElement = data.totalElements;
          this.tableData = data.content;
          setTimeout(() => {
            this.loading = false
          }, 500)
        }).catch(() => {
          this.loading = false
        })
      },

      memberExport: function () {
        this.$confirm('是否导出会员列表?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          location.href = url + '/member/export/member_export?payload=' + sessionStorage.getItem('token').split('.')[1]
        })
      },

      downloadTemp: function () {
        this.$confirm('是否下载导入模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          location.href = url + '/member/member_template.xls'
        })
      },
      importSuccess: function (response, file, fileList) {
        this.$alert(response.msg, '导入结果', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          callback: action => {
            this.$refs.page.refresh()
          }
        })
      },
      /**
       * 导入前检查
       */
      beforeExcelUpload: function (file) {
        console.log(file)
      },

      /**
       *打开编辑模态框
       */
      editMemberOpen: function (data) {
        this.editForm.id = data.id;
        this.editForm.phone = data.phone;
        this.editForm.sex = data.sex + '';
        this.editForm.nickname = data.nickname;
        this.editForm.birthday = data.birthday;
        this.editMemberDialogVisible = true
      },

      /**
       *关闭编辑模态框
       */
      editMemberClose: function () {
        this.resetForm('editForm');
        this.editMemberDialogVisible = false
      },
      /**
       *提交编辑 并 关闭编辑模态框
       */
      editMemberSubmit: function () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.btnLoading = true; //按钮锁定
            editMember(this.editForm).then(response => {
              this.$refs.page.refresh();
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.btnLoading = false; //按钮解锁
              //this.closeEditDialog();
              //验证通过
              this.resetForm('editForm');
              this.editMemberDialogVisible = false //关闭模态框
            }).catch(() => {
              this.btnLoading = false; //按钮解锁
              this.loading = false
            });
          } else {
            console.log('还有未输入的内容');
            return false
          }
        })

      },

      /**
       *删除会员提示框
       */
      deleteMemberOpen: function (data) {
        this.$confirm('确定删除吗？删除后会员积分将清空', '删除会员', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          let id = data.cardId;
          this.deleteMember(id)

        }).catch(() => {

          this.$message({
            type: 'info',
            message: '已取消删除'
          })

        })
      },

      /**
       *删除会员
       */
      deleteMember: function (data) {
        //被删除的id
        console.log(data);
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      },


      /**
       * 打开充值
       */
      chargeOpen: function (id) {
        this.chargeForm.id = id;
        this.chargeVisible = true
      },
      chargeClose: function () {
        this.chargeVisible = false
      },
      confirmCharge: function () {
        let form = this.chargeForm;
        let money = form.money;
        this.$confirm(`充值${money}元, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitCharge()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      submitCharge: function () {
        let form = this.chargeForm;
        console.log(form)
      },

      refresh() {
        this.$refs.page.refresh()
      },


      //**************************会员分析

      /**
       * 修改日期范围
       */
      changeDays: function () {
        let timestamp = (new Date()).getTime();
        let range = this.dayRange;
        this.analysisSearchForm.startTime = '';
        this.analysisSearchForm.endTime = '';
        if (range == '0') {
          this.analysisSearchForm.startTime = timestamp;
          this.analysisSearchForm.endTime = timestamp
        } else if (range == '1') {
          this.analysisSearchForm.startTime = (timestamp - (60 * 60 * 24 * 1000));
          this.analysisSearchForm.endTime = (timestamp - (60 * 60 * 24 * 1000))
        } else if (range == '2') {
          this.analysisSearchForm.startTime = (timestamp - (60 * 60 * 24 * 1000 * 6));
          this.analysisSearchForm.endTime = timestamp
        } else if (range == '3') {
          this.analysisSearchForm.startTime = (timestamp - (60 * 60 * 24 * 1000 * 30));
          this.analysisSearchForm.endTime = timestamp
        }
        // 修改时间后发起一次搜索
        //this.submitSearchByAnalysis()
      },
      /**
       * 会员分析提交搜索
       */
      submitSearchByAnalysis: function () {
        let data = this.analysisSearchForm;
        if (data.startTime == '' || data.endTime == '') {
          this.$message('搜索全部')
        }
        //格式化时间
        let s = this.format(data.startTime);
        let e = this.format(data.endTime);
        console.log(s, e);
        //获取数据
        findAnalyseCard(s, e).then(res => {
          this.analysisCardData = res.obj;
          this.getAnalyseByActivity(s, e)
        }).catch(error => {
          this.$message.error('获取卡片数据错误')
        });
        setTimeout(this.lineOneChartChange(), 500)

      },

      /**
       *上图表切换
       */
      lineOneChartChange: function () {
        let data = this.analysisSearchForm;
        let s = this.format(data.startTime);
        let e = this.format(data.endTime);

        let tabs = this.lineOneChartTab;
        if (tabs == '1') {
          // 按时间
          findAnalyseByTime(s, e).then(res => {
            console.log(res);
            this.drawLineOneChartByTime(res.obj)
          }).catch(e => {

          })

        } else if (tabs == '2') {
          // 按门店
        } else if (tabs == '3') {
          // 按渠道
          findAnalyseByChannel(s, e).then(res => {
            console.log(res);
            this.drawLineOneChartByChannel(res.obj)
          }).catch(e => {

          })
        } else if (tabs == '4') {
          // 按性别
          findAnalyseBySex(s, e).then(res => {
            console.log(res);
            this.drawLineOneChartByGender(res.obj)
          }).catch(e => {

          })
        }
      },
      /**
       * 渲染图表 上面 按时间
       */
      drawLineOneChartByTime: function (data) {
        let cTotal = data.num;
        let cNew = data.ydata;
        let cxData = data.xdata;
        var chart = this.$echarts.init(document.getElementById('lineOne1'));
        chart.setOption({
          // title: {text: '商户统计', textStyle: {color: '#333', fontWeight: 'lighter', fontSize: '16'}},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} @ {c} ',
          },
          legend: {
            data: ['新增会员量', '会员总量']
          },
          toolbox: {
            feature: {
              magicType: {
                type: ['line', 'bar']
              },
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: cxData
          },//X轴标题
          yAxis: {
            type: 'value'
          },
          series: [{
            data: cNew,
            name: '新增会员量',
            type: 'line',
            areaStyle: {}
          }, {
            data: cTotal,
            name: '会员总量',
            type: 'line',
            areaStyle: {}
          }] //数据数组，多个数据，legend需要对于标题name
        })

      },
      /**
       * 渲染图表 上面 按门店
       */
      drawLineOneChartByStore: function () {

      },
      /**
       * 渲染图表 上面 按渠道
       */
      drawLineOneChartByChannel: function (data) {
        let nMc = data.newMemberCount;
        let tMc = data.totalMemberCount;
        var chart = this.$echarts.init(document.getElementById('lineOne3'));
        chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['小程序', '商户APP', '商户导入']
          },
          series: [
            {
              name: '新增会员量',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '30%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: nMc
            },
            {
              name: '会员总量',
              type: 'pie',
              radius: ['40%', '55%'],
              label: {
                normal: {
                  formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                  backgroundColor: '#eee',
                  borderColor: '#aaa',
                  borderWidth: 1,
                  borderRadius: 4,
                  // shadowBlur:3,
                  // shadowOffsetX: 2,
                  // shadowOffsetY: 2,
                  // shadowColor: '#999',
                  // padding: [0, 7],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    // abg: {
                    //     backgroundColor: '#333',
                    //     width: '100%',
                    //     align: 'right',
                    //     height: 22,
                    //     borderRadius: [4, 4, 0, 0]
                    // },
                    hr: {
                      borderColor: '#aaa',
                      width: '100%',
                      borderWidth: 0.5,
                      height: 0
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    },
                    per: {
                      color: '#eee',
                      backgroundColor: '#334455',
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data: tMc
            }
          ]
        })

      },
      /**
       * 渲染图表 上面 按性别
       */
      drawLineOneChartByGender: function (data) {
        console.log(data);
        let newMTotal = 0; //新增会员总个数

        //赋值到变量
        for (let i = 0; i < data.newMemberCount.length; i++) {
          newMTotal += data.newMemberCount[i].value;
          if (data.newMemberCount[i].name === '男' && data.newMemberCount[i].value != null) {
            this.$set(this.genderProportion, 'newMemberBoy', data.newMemberCount[i].value)
          }
          if (data.newMemberCount[i].name === '女' && data.newMemberCount[i].value != null) {
            this.$set(this.genderProportion, 'newMemberGirl', data.newMemberCount[i].value)
          }
        }
        //如果后端只传来一个性别的情况
        if (data.newMemberCount.length < 2) {
          if (data.newMemberCount[0].name === '男') {
            this.$set(this.genderProportion, 'newMemberGirl', 0)
          } else {
            this.$set(this.genderProportion, 'newMemberBoy', 0)
          }
        }

        //判断数值为0情况
        if (this.genderProportion.newMemberGirl == 0 && this.genderProportion.newMemberBoy == 0) {
          this.genderProportion.nGp = 0;
          this.genderProportion.nBp = 0

        } else if (this.genderProportion.newMemberGirl == 0 && this.genderProportion.newMemberBoy != 0) {
          this.genderProportion.nGp = 0;
          this.genderProportion.nBp = 1
        } else if (this.genderProportion.newMemberGirl != 0 && this.genderProportion.newMemberBoy == 0) {
          this.genderProportion.nGp = 1;
          this.genderProportion.nBp = 0
        } else {
          this.genderProportion.nGp = (this.genderProportion.newMemberGirl / newMTotal).toFixed(2);
          this.genderProportion.nBp = (this.genderProportion.newMemberBoy / newMTotal).toFixed(2)
        }
        this.$set(this.genderProportion, 'newMemberTotal', newMTotal);


        let AllMTotal = 0; //所有会员总个数
        for (let i = 0; i < data.totalMemberCount.length; i++) {
          AllMTotal += data.totalMemberCount[i].value;
          if (data.totalMemberCount[i].name === '男') {
            this.$set(this.genderProportion, 'totalMemberBoy', data.totalMemberCount[i].value)
          } else if (data.totalMemberCount[i].name === '女') {
            this.$set(this.genderProportion, 'totalMemberGirl', data.totalMemberCount[i].value)
          }
        }
        if (this.genderProportion.totalMemberGirl == 0 && this.genderProportion.totalMemberBoy == 0) {
          this.genderProportion.tGp = 0;
          this.genderProportion.tBp = 0
        } else if (this.genderProportion.totalMemberGirl == 0 && this.genderProportion.totalMemberBoy != 0) {
          this.genderProportion.tGp = 0;
          this.genderProportion.tBp = 1
        } else if (this.genderProportion.totalMemberGirl != 0 && this.genderProportion.totalMemberBoy == 0) {
          this.genderProportion.tGp = 1;
          this.genderProportion.tBp = 0
        } else {
          this.genderProportion.tGp = (this.genderProportion.totalMemberGirl / AllMTotal).toFixed(2);
          this.genderProportion.tBp = (this.genderProportion.totalMemberBoy / AllMTotal).toFixed(2)
        }
        this.$set(this.genderProportion, 'totalMemberTotal', AllMTotal)

      },

      /**
       * 获取活跃度分析图表
       */
      getAnalyseByActivity: function (s, e) {
        findAnalyseByActivity(s, e).then(res => {
          this.drawLineTwoChart(res.obj);
          this.activityData = res.obj
        }).catch(e => {

        })
      },

      /**
       * 渲染图表 下面 会员活跃分析
       */
      drawLineTwoChart: function (data) {
        let title = [];
        let totalNum = 0;
        for (let i in data) {
          title.push(data[i].name);
          totalNum += parseInt(data[i].value)
        }
        this.activityDataTotal = totalNum;
        var chart = this.$echarts.init(document.getElementById('lineTwo1'));
        chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: title
          },
          series: [
            {
              name: '活跃分析',
              type: 'pie',
              radius: ['40%', '55%'],
              label: {
                normal: {
                  formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                  backgroundColor: '#eee',
                  borderColor: '#aaa',
                  borderWidth: 1,
                  borderRadius: 4,
                  // shadowBlur:3,
                  // shadowOffsetX: 2,
                  // shadowOffsetY: 2,
                  // shadowColor: '#999',
                  // padding: [0, 7],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    // abg: {
                    //     backgroundColor: '#333',
                    //     width: '100%',
                    //     align: 'right',
                    //     height: 22,
                    //     borderRadius: [4, 4, 0, 0]
                    // },
                    hr: {
                      borderColor: '#aaa',
                      width: '100%',
                      borderWidth: 0.5,
                      height: 0
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    },
                    per: {
                      color: '#eee',
                      backgroundColor: '#334455',
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data: data
            }
          ]
        })

      },

      //工具***************************************************

      /**
       * resetForm 重置表单
       */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /**
       * reset 重置搜索
       */
      reset: function () {
        this.searchForm = {
          startTime: '',
          endTime: '',
          number: ''
        };
        //重置后重新发起搜索
        this.submitSearchByList()
        //会员列表搜索
      },
      resetAnalysis: function () {
        // this.analysisSearchForm = {
        //   startTime: '',
        //   endTime: ''
        // }; //会员分析搜索条件
        this.dayRange = '0';
        this.changeDays();
        this.submitSearchByAnalysis()
      },

      /**
       * 工具
       * @param ts 时间戳
       * @returns {string} 格式化事时间
       */
      //时间格式化
      format(ts) {
        let time = new Date(ts);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        return y + '-' + this.add0(m) + '-' + this.add0(d)
      },

      /**
       * 补充0
       * @param  m 月和日，补齐2位
       * @returns {string} 补齐2二位后的时间
       */
      add0(m) {
        return m < 10 ? '0' + m : m
      },

    }
  }
</script>

<style scoped>
  /*public*/
  .nodata {
    position: relative;
    left: 0;
    top: -20px;
    width: 100%;
    height: 100%;
    background-color: #3A3A3A;
  }

  .block {
    display: inline-block;
    vertical-align: middle;
  }

  /*private*/
  .tab_header_bar {

  }


  .tab_bottom {

  }

  /*卡片*/
  .card_group {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
  }

  .card_item {
    padding: 0;
    width: 15%;
    max-width: 100%;
    margin: 20px 1% 0 1%;
  }


  .tools_box {
    padding: 0 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }


  .tools_img {
    width: 30%;
    text-align: left;
  }

  .tools_text {
    width: 70%;
    text-align: right;
  }

  .tools_text p {
    margin: 0;
    padding: 0;
    cursor: default;
  }

  .tools_text p:nth-child(1) {
    font-size: 12px;
    color: #888;
  }

  .tools_text p:nth-child(2) {
    padding: 5px 0 0 0;
    font-size: 20px;
    color: #3f3f3f;
  }

  /*图表*/
  .chart_img {
    width: 100%;
    height: 400px;
  }

  .lineTwo_chart_img {
    width: 50%;
    height: 400px;
  }

  .lineTwo_chart_text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .analysisBox {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .analysis_table {
    border: 1px solid #cdcdcd;
    font-size: 14px;
  }

  .analysis_table thead tr {
    font-weight: bold;
    height: 24px;
    line-height: 28px;
    text-align: left;
  }

  .analysis_table tbody tr td {
    color: #718195;
  }

  .gender_bar_box {

  }

  .gender_bar_item {
    margin: 0 auto;
    width: 50%;
  }

  .bar_content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .bar_title p {
    padding: 0;
    font-size: 16px;
    text-align: center;
  }

  .bar_icon_group {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .bar_icon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .icon_img {

  }

  .bar_proportion {
    height: 20px;
    width: 100%;
    background-color: #ffac21;
  }

  .girl_mark {
    position: relative;
    top: 0;
    left: 0;
    height: 20px;
    background-color: #81be94;
  }


</style>
