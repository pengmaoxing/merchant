<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">

      <el-tabs v-model="tabsNum" @tab-click="changeTabs">


        <el-tab-pane label="储值规则" name="0">
          <!--header-->
          <div class="rule_header">
            <div>
              <el-form :inline="true" :model="customSwitchForm" style="height: 10px">
                <el-form-item label="自定义储值规则">
                  <el-switch
                    v-model="customSwitchForm.status"
                    @change="changeSwitchStatus"
                    active-color="#FF803E"
                    inactive-color="#AAA"
                    :active-value='1'
                    :inactive-value='2'
                    active-text="开"
                    inactive-text="关">
                  </el-switch>
                  <span class="switch_tips">开关开启后，会员可以储值任意金额</span>
                </el-form-item>
              </el-form>
            </div>
            <div style="margin-left: auto">
              <el-button type="primary" @click="addRuleOpen">新增储值规则</el-button>
            </div>
          </div>

          <el-divider></el-divider>

          <!--内容表格-->
          <div>

            <el-table
              :data="storedTable"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="name"
                label="储值规则名称">
              </el-table-column>
              <el-table-column
                label="储值规则">
                <template slot-scope="scope">
                  {{scope.row | ruleText}}
                </template>
              </el-table-column>
              <el-table-column
                prop="storedAmount"
                label="储值笔数">
              </el-table-column>
              <el-table-column
                label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.status | statusFilters }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="300px">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.status==2" @click="ruleStart(scope.row)" type="text">启用</el-button>
                  <el-button v-if="scope.row.status==1" @click="rulePause(scope.row)" type="text">停用</el-button>
                  <el-button v-if="scope.row.status==2" @click="ruleDelete(scope.row)" type="text">删除</el-button>
                  <el-button v-if="scope.row.giftType==3" @click="goCouponDetail(scope.row.couponId)" type="text">查看卡券
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              :total-elements="storedTableTotalElement"
              :change-callback="getStoredRuleList"
              ref="storedPage"></pagination>

          </div>


        </el-tab-pane>


        <el-tab-pane label="储值记录" name="1">
          <el-card class="box-card">

            <div class="list_header">
              <!--第一行-->
              <div>
                <div class="block">
                  <el-input v-model="searchForm.phone" size="medium" placeholder="手机号"></el-input>
                </div>
                <div class="block">
                  <div class="block">
                    <el-date-picker
                      v-model="searchForm.start_createTime"
                      @change="checkDays"
                      type="date"
                      size="medium"
                      placeholder="开始日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="timestamp"
                      style="width: 190px">
                    </el-date-picker>
                    至
                    <el-date-picker
                      v-model="searchForm.end_createTime"
                      @change="checkDays"
                      type="date"
                      size="medium"
                      placeholder="结束日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="timestamp"
                      style="width: 190px">
                    </el-date-picker>
                  </div>
                </div>
                <div class="block" style="margin-left: 10px">
                  <el-button size="medium" type="primary" @click="submitRecordSearch">查 询</el-button>
                  <el-button size="medium" type="" @click="resetForm">重 置</el-button>
                  <el-button size="medium" type="" @click="recordExport">导 出</el-button>
                </div>
              </div>
              <!--第二行-->
              <div style="margin-top: 10px">
                <div class="block">
                  <el-select size="medium" v-model="searchForm.tradeType" placeholder="请选择交易类型">
                    <el-option label="全部交易类型" value=""></el-option>
                    <el-option label="充值" value="1"></el-option>
                    <el-option label="消费" value="2"></el-option>
                    <el-option label="退款" value="3"></el-option>
                    <el-option label="导入" value="4"></el-option>
                  </el-select>
                </div>

                <div class="block">
                  <el-select size="medium" v-model="searchForm.source" placeholder="请选择来源">
                    <el-option label="全部来源" value=""></el-option>
                    <el-option label="PC" value="1"></el-option>
                    <el-option label="ANDROID" value="2"></el-option>
                    <el-option label="iOS" value="3"></el-option>
                    <el-option label="H5" value="4"></el-option>
                  </el-select>
                </div>

                <div class="block">
                  <el-select v-model="searchForm.storeId" size="medium" placeholder="交易门店"
                             style="width: 150px"
                             v-if="userType==1">
                    <el-option label="全部门店" value=""></el-option>
                    <el-option
                      v-for="item in storeOption"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="block">
                  <el-select v-model="searchForm.payWay" size="medium" placeholder="支付方式"
                             style="width: 150px">
                    <el-option label="全部支付方式" value=""></el-option>
                    <el-option
                      v-for="item in payOption"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <el-divider></el-divider>
            <!--卡片-->
            <div class="card_group">

              <div class="card_item">

                <!--第一行-->
                <div class="card_line_1">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/规则储值总额.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>储值总额
                      <el-tooltip class="item" effect="light" content="储值总额" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>￥{{cardData.actualMoney+cardData.giftMoney}}</p>
                  </div>
                </div>
                <!--第二行-->
                <div class="card_line_2">
                  <div class="">
                    <p>实际储值:</p>
                    <p>赠送金额:</p>
                  </div>
                  <div>
                    <p class="green">￥{{cardData.actualMoney}}</p>
                    <p>￥{{cardData.giftMoney}}</p>
                  </div>


                </div>

              </div>

              <div class="card_item">

                <!--第一行-->
                <div class="card_line_1">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/规则储值消费.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>储值消费
                      <el-tooltip class="item" effect="light" content="储值消费" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>￥{{cardData.usedMoney-cardData.refundMoney}}</p>
                  </div>
                </div>
                <!--第二行-->
                <div class="card_line_2">
                  <div class="">
                    <p>消费扣款:</p>
                    <p>退款退回:</p>
                  </div>
                  <div>
                    <p class="green">￥{{cardData.usedMoney}}</p>
                    <p>￥{{cardData.refundMoney}}</p>
                  </div>


                </div>

              </div>

              <div class="card_item">

                <!--第一行-->
                <div class="card_line_1">
                  <div class="tools_img">
                    <img src="../../../assets/images/member/规则储值余额.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>储值余额
                      <el-tooltip class="item" effect="light" content="储值余额" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>￥{{cardData.resuletMoney}}</p>
                  </div>
                </div>
                <!--第二行-->
                <div class="card_line_2">
                  <div class="">
                    <p>历史储值:</p>
                    <p>历史消耗:</p>
                  </div>
                  <div>
                    <p class="green">￥{{cardData.actualMoney+cardData.giftMoney}}</p>
                    <p>￥{{cardData.usedMoney}}</p>
                  </div>


                </div>

              </div>
            </div>

            <el-divider content-position="left">储值明细报表</el-divider>

            <!--表格-->
            <div>
              <el-table
                :data="storedRecordTable"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="storedNum"
                  label="交易单号"
                  width="210px"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="交易时间"
                  width="160px"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="手机号">
                </el-table-column>
                <el-table-column
                  prop="tradeTypeText"
                  label="交易类型">
                </el-table-column>
                <el-table-column
                  prop="tradingMoney"
                  label="交易金额">
                </el-table-column>
                <el-table-column
                  prop="giftMoney"
                  label="赠送金额">
                </el-table-column>
                <el-table-column
                  prop="postTradingMoney"
                  label="交易后余额">
                </el-table-column>
                <el-table-column
                  prop="scores"
                  label="赠送积分">
                </el-table-column>
                <el-table-column
                  prop="operationUser"
                  label="操作人"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="payWayText"
                  label="支付方式">
                </el-table-column>
                <el-table-column
                  prop="sourceText"
                  label="来源"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="storeName"
                  label="门店"
                  show-overflow-tooltip>
                </el-table-column>

                <!--之后再开通-->

                <!--<el-table-column-->
                <!--label="操作">-->
                <!--<template slot-scope="scope">-->
                <!--<el-button type="text" @click="goDetail(scope.row.storedNum)">详情</el-button>-->
                <!--</template>-->
                <!--</el-table-column>-->
              </el-table>
              <pagination
                :total-elements="storedRecordTotalElement"
                :change-callback="findRecordList"
                ref="page"></pagination>
            </div>


          </el-card>
        </el-tab-pane>


      </el-tabs>
    </el-card>


    <!--模态框-->
    <el-dialog
      title="新增储值规则"
      :visible.sync="addRuleVisible"
      width="576px"
      :before-close="addRuleClose">

      <div>
        <el-form ref="addRuleForm" :rules="newStoredRules" :model="addRuleForm" label-width="120px">
          <el-form-item label="储值规则名称" prop="name">
            <el-input v-model="addRuleForm.name"></el-input>
          </el-form-item>

          <el-form-item label="储值金额" prop="storedMoney">
            <el-input v-model="addRuleForm.storedMoney"></el-input>
          </el-form-item>

          <el-form-item label="赠送优惠" prop="giftType">
            <el-radio-group v-model="addRuleForm.giftType">
              <el-radio label="1">送金额</el-radio>
              <el-radio label="2">送积分</el-radio>
              <el-radio label="3">送优惠券</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="赠送优惠">
            <div v-if="addRuleForm.giftType==1">
              <el-form-item prop="giftMoney">
                <el-input v-model="addRuleForm.giftMoney" placeholder="请输入金额" style="width: 150px"
                          size="medium"></el-input>
                &nbsp元
              </el-form-item>
            </div>

            <div v-else-if="addRuleForm.giftType==2">
              <el-form-item prop="giftMoney">
                <el-input v-model="addRuleForm.giftMoney" placeholder="请输入积分" style="width: 150px"
                          size="medium"></el-input>
                &nbsp分
              </el-form-item>
            </div>

            <div v-else="addRuleForm.giftType==3">
              <el-button v-if="couponId==''" type="primary" size="medium" @click="selectCouponOpen">添加卡券
              </el-button>
              <el-button type="text" v-else @click="selectCouponOpen">{{couponName}}</el-button>
            </div>
          </el-form-item>

          <el-form-item label="状态">
            <el-switch class="switch_box"
                       style="display: block"
                       v-model="addRuleForm.status"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       active-value="1"
                       inactive-value="2"
                       active-text="启用"
                       inactive-text="禁用">
            </el-switch>
          </el-form-item>

        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
      <el-button @click="addRuleClose">取 消</el-button>
      <el-button type="primary" @click="addRuleSubmit" v-loading="btnLoading" :disabled="btnLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!--选择卡券-->
    <el-dialog
      title="提示"
      :visible.sync="selectCouponVisible"
      width="50%"
      :before-close="selectCouponClose">
      <div>
        <!--创建卡券  2/模态框模式 子组件保存后关闭父级模态框-->
        <createcoupon openmode="3" :couponid="couponId" v-on:closefatherdialog="selectCouponClose"
                      v-on:closefatherdialogbysavesuccess="addCouponCloseBySave"
                      v-if="createcouponReset"></createcoupon>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {url} from '@/utils/request'
  import {
    findByMerchantId, addStoredRule, changeStoredRuleStatus, deleteStoredRule,
    findSwitchByMchId, updateSwitch, findRecordList, findRecordCard,
    findOrderPayWayOption, findStoreOption, listExport
  } from '../api/storedValueRule'
  import createcoupon from '@/components/createCoupon/index' //引入卡券组件

  export default {
    name: 'storedValueRule',
    components: {pagination, createcoupon},
    data() {
      var validateStoredMoney = (rule, value, callback) => {
        let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
        if (value == 0) {
          callback(new Error('储值金额禁止为0'))
        } else if (value >= 100000) {
          callback(new Error('储值金额无法大于100000'))
        } else if (!reg.test(value)) {
          callback(new Error('金额错误（仅接受数值，小数最多精确到两位）'))
        } else {
          callback()
        }
      };
      var validateGiftMoney = (rule, value, callback) => {
        let reg = /^([1-9]\d*|[0]{1,1})$/;
        if (value == 0) {
          callback(new Error(`不能等于0`))
        } else if (value >= 100000) {
          callback(new Error(`无法大于100000`))
        } else if (!reg.test(value)) {
          callback(new Error(`填写错误（仅接受正整数,）`))
        } else {
          callback()
        }
      };
      return {
        tabsNum: '0',//标签页号数
        userType: 3,
        loading: true,
        btnLoading: false,
        customSwitchForm: {
          id: '',
          status: 2
        },//开关
        storedTable: [],//表格
        storedTableTotalElement: 0,//条数
        //新增储值规则
        addRuleVisible: false,
        addRuleForm: {
          name: '',
          storedMoney: '',
          giftMoney: '',
          giftType: '',
          status: '1'
        },
        couponId: '',
        couponName: '',
        //记录
        searchForm: {
          phone: '',
          start_createTime: '',
          end_createTime: '',
          tradeType: '',
          storeId: '',
          payWay: '',
          source: ''
        },
        storedRecordTable: [],
        storedRecordTotalElement: 0,
        cardData: {
          actualMoney: 0,
          giftMoney: 0,
          resuletMoney: 0,
          usedMoney: 0,
          refundMoney: 0,
        },
        storeOption: [],
        payOption: [
          {value: 1, name: '微信'},
          {value: 2, name: '阿里'},
          {value: 3, name: '储值卡'},
          {value: 4, name: 'H5'},
          {value: 5, name: '导入'},
        ],
        backData: {}, //URL数据
        jumpPage: {},//翻页数据
        //-----------------------------
        selectCouponVisible: false,// 选择卡券模态框
        createcouponReset: true,

        //新增储值校验
        newStoredRules: {
          name: [
            {required: true, message: '请输入储值规则名称', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          storedMoney: [
            {required: true, message: '请输入储值金额', trigger: 'blur'},
            {validator: validateStoredMoney, trigger: 'blur'}
          ],
          giftType: [
            {required: true, message: '必须选择一种优惠', trigger: 'change'},
          ],
          giftMoney: [
            {validator: validateGiftMoney, trigger: 'blur'}
          ]
        }

      }
    },
    mounted() {
      //获取用户类型
      this.userType = sessionStorage.getItem('userType') || 3;

      //返回的链接，修改本页内容,保存上一次的页面
      let data = this.$route.query;
      this.tabsNum = data.tn || '0';
      this.searchForm.phone = data.pe || '';//Phone
      this.searchForm.start_createTime = data.st || ''; //starttime
      this.searchForm.end_createTime = data.et || '';//endtime
      this.searchForm.tradeType = data.tt || '';
      this.searchForm.storeId = data.si || '';
      this.searchForm.payWay = data.pw || '';
      this.searchForm.source = data.sc || '';

      //不同用户 选项不同
      if (this.userType == 1) {
        this.getStoreOptionList()
      }

      //设置默认日期天数
      this.changeDays();
      //获取当前开关状态
      this.getSwitchStatus();
      //获取储值规则列表
      this.getStoredRuleList(1, 10);
      //获取储值记录列表
      this.findRecordList(data.pn || 1, data.ps || 10)

    },
    filters: {
      statusFilters: function (val) {
        let v = parseInt(val);
        let t = '未知';
        switch (v) {
          case 1:
            t = '启用';
            break;
          case 2:
            t = '禁用';
            break;
          default :
            break
        }

        return t
      },
      ruleText: function (data) {
        let txt = '';
        if (data.giftType == 1) {
          txt = '充' + data.storedMoney + '元赠送' + data.giftMoney + '元'
        } else if (data.giftType == 2) {
          txt = '充' + data.storedMoney + '元赠送' + data.giftMoney + '积分'
        } else if (data.giftType == 3 && data.couponId != '') {
          txt = '充' + data.storedMoney + '元赠送代金券'
        }

        return txt
      }
    },
    methods: {
      recordExport: function () {
        let post = {};
        let data = this.searchForm;
        post.phone = data.phone;
        post.start_createTime = this.format(data.start_createTime);
        post.end_createTime = this.format(data.end_createTime);
        post.tradeType = data.tradeType;
        post.source = data.source;
        post.storeId = data.storeId;
        post.payWay = data.payWay;
        this.$confirm('是否导出' + post.start_createTime + '至' + post.end_createTime + "的流水列表？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          listExport(post).then(res => {
            console.log(res);

            // let blob = new Blob([res], {type: "application/vnd.ms-excel"});
            // let url = window.URL.createObjectURL(blob);
            // window.location.href = url;
            // this.$message.success('开始下载')

            let a = document.createElement('a');
            let companyName=sessionStorage.getItem('name') || ''
            let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
            let objectUrl = URL.createObjectURL(blob);
            a.setAttribute("href", objectUrl);
            a.setAttribute("download", `${companyName}_${post.start_createTime}_${post.end_createTime}_会员储值记录`);
            a.click();

            // location.href = url + '/excel/' + res.obj;
          }).catch(e => {
            this.$message.error('列表获取错误')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          });
        });
      },
      /**
       * 获取交易门店Option
       */
      getStoreOptionList: function () {
        findStoreOption().then(res => {
          let data = res.obj;
          this.storeOption = data
        }).catch(e => {

        })
      },

      // /**
      //  * 获取支付方式Option
      //  */
      // getPayWayOptionList: function () {
      //   findOrderPayWayOption().then(res => {
      //     let data = res.obj
      //     this.payOption = data
      //   }).catch(e => {
      //
      //   })
      // },

      /**
       * 切换标签页
       */
      changeTabs: function () {

      },
      /**
       * 获取列表
       */
      getStoredRuleList: function (number, pageSize) {
        this.loading = true;
        findByMerchantId(number, pageSize).then(response => {
          let data = response.obj;
          // console.log(data)
          this.storedTableTotalElement = data.totalElements;
          this.storedTable = data.content;
          setTimeout(() => {
            this.loading = false
          }, 500)
        }).catch(() => {
          this.loading = false
        })
      },
      /**
       * 获取开关状态
       */
      getSwitchStatus: function () {
        findSwitchByMchId().then(response => {
          let data = response.obj;
          console.log(data.status);
          this.$set(this.customSwitchForm, 'status', parseInt(data.status));
          this.customSwitchForm.id = data.id //开关id
          //console.log('现在获取到的状态' + typeof this.customSwitchForm.status + data.status)
        }).catch(() => {
        })
      },
      /**
       * 修改开关状态
       */
      changeSwitchStatus: function () {
        this.updataSwitch(this.customSwitchForm)
      },
      /**
       * 发送开关状态
       */
      updataSwitch: function (data) {
        let s = data.status;
        let id = data.id;
        console.warn(s);
        updateSwitch(s, id).then(response => {
          this.$message({
            showClose: true,
            message: '已' + (s == 1 ? '开启自定义储值' : '关闭自定义储值') + '。',
            type: (s == 1 ? 'success' : 'info')
          });

          // 更改成功后，更新按钮状态
          this.getSwitchStatus()
        }).catch(() => {
        })
      },

      /**
       * 表格操作  启用规则
       */
      ruleStart: function (data) {
        let id = data.id;
        this.$confirm('确定启用吗？', '启用储值规则', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          changeStoredRuleStatus(id, 1).then(res => {
            this.$refs.storedPage.refresh();//刷新储值规则
            this.$message.success('启用成功')
          }).catch(e => {

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })

        })

      },

      /**
       * 表格操作   停用规则
       */
      rulePause: function (data) {
        let id = data.id;
        this.$confirm('确定关闭？关闭后不能再使用此储值规则', '停用储值规则', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          changeStoredRuleStatus(id, 2).then(res => {
            this.$refs.storedPage.refresh();//刷新储值规则
            this.$message.success('停用成功')
          }).catch(e => {

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停用'
          })

        })
      },

      /**
       * 表格操作   删除规则
       */
      ruleDelete: function (data) {
        let id = data.id;
        this.$confirm('确定删除吗？', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          deleteStoredRule(id).then(res => {
            this.$refs.storedPage.refresh();//刷新储值规则
            this.$message.success('删除成功')
          }).catch(e => {
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })

        })
      },

      /**
       * 表格操作   查看卡券
       */
      ruleSee: function (data) {

      },

      /**
       * 打开新增规则莫模态框
       */
      addRuleOpen: function () {
        this.addRuleForm = {
          name: '',
          storedMoney: '',
          giftMoney: '',
          giftType: '',
          status: '1'
        };
        this.addRuleVisible = true;
        this.addRuleForm.giftType = '1'
      },

      /**
       * 关闭新增规则模态框
       */
      addRuleClose: function () {
        this.addRuleForm = {
          name: '',
          storedMoney: '',
          giftMoney: '',
          giftType: '',
          status: '1'
        };
        this.couponId = '';
        this.couponName = '';
        this.addRuleVisible = false
      },

      /**
       * 关闭新增规则模态框
       */
      addRuleSubmit: function () {
        this.btnLoading = true;//锁定按钮
        let data = this.deepCopy(this.addRuleForm);

        let tmp = {};
        tmp.name = data.name;
        tmp.storedMoney = data.storedMoney;
        tmp.giftType = data.giftType;
        tmp.status = data.status;
        if (data.giftType == 1 || data.giftType == 2) {
          tmp.giftMoney = data.giftMoney
        } else if (data.giftType == 3) {
          //卡券是否创建 判断
          if (this.couponId == '') {
            this.$message.error('还未添加卡券');
            this.btnLoading = false;//解锁按钮
            return
          } else {
            //正确创建卡券
            tmp.couponId = this.couponId
          }
        }

        this.$refs['addRuleForm'].validate((valid) => {
          if (valid) {
            addStoredRule(tmp).then(res => {
              this.$message.success('保存成功');
              this.btnLoading = false;//解锁按钮
              this.addRuleClose();
              this.getStoredRuleList(1, 10)
            }).catch(e => {
              //错误
              this.btnLoading = false //解锁按钮
            })
          } else {
            console.log('error submit!!');
            this.btnLoading = false;//解锁按钮
            return false
          }
        })

      },
      //***************************记录******************************
      submitRecordSearch: function () {
        this.findRecordList(1, 10)
      },
      /**
       *获取记录列表
       */
      findRecordList: function (pageNum, pageSize) {
        let post = {};
        this.jumpPage.pn = pageNum || 0;
        this.jumpPage.ps = pageSize || 10;
        let data = this.searchForm;
        post.phone = data.phone;
        post.start_createTime = this.format(data.start_createTime);
        post.end_createTime = this.format(data.end_createTime);
        post.tradeType = data.tradeType;
        post.source = data.source;
        post.storeId = data.storeId;
        post.payWay = data.payWay;
        //获取列表
        findRecordList(pageNum, pageSize, post).then(res => {
          //console.log(res);
          let data = res.obj;
          this.storedRecordTable = data.content;
          this.storedRecordTotalElement = data.totalElements

        }).catch(e => {

        });
        //获取卡片数据
        findRecordCard(post).then(res => {
          // console.log(res)
          let data = res.obj;
          this.cardData = data
        }).catch(e => {

        })

      },
      /**
       * 前往详情
       */
      goDetail: function (id) {
        //保存标签页
        let tn = this.tabsNum;
        //保存搜索条件数据
        let data = this.searchForm;
        let pe = data.phone;
        let st = data.start_createTime;
        let et = data.end_createTime;
        let tt = data.tradeType;
        let sc = data.source;
        let si = data.storeId;
        let pw = data.payWay;
        let pn = this.jumpPage.pn;
        let ps = this.jumpPage.ps;
        //跳转带参
        this.$router.push({
          path: '/member/views/storedValueDetail',
          query: {id: id, tn: tn, pe: pe, st: st, et: et, tt: tt, sc: sc, si: si, pw: pw, pn: pn, ps: ps}
        })
      },

      //-------------------------------选中卡券
      /**
       * 选中卡券模态框打开
       */
      selectCouponOpen: function () {
        // 重置卡券组件
        this.createcouponReset = false;
        this.$nextTick(() => {
          this.createcouponReset = true
        });

        //操作成功，打开模态框
        this.selectCouponVisible = true
      },
      /**
       * 选中卡券模态框关闭
       */
      selectCouponClose: function () {
        //操作成功，关闭
        this.selectCouponVisible = false
      },
      /**
       * 关闭新增卡券模态框 【保存成功】
       */
      addCouponCloseBySave: function (data) {
        this.couponId = data.saveid;
        this.couponName = data.name;
        //this.findBindCardCoupon() //成功后获取新的卡券信息
        //关闭模态框
        this.selectCouponVisible = false
      },
      /**
       *前往详情
       */
      goCouponDetail: function (data) {
        let id = data;
        this.$router.push({path: '/couponMarketing/couponDetail', query: {id: id}})
        // console.log(data)
      },

      /**
       * 工具
       * @param ts 时间戳
       * @returns {string} 格式化事时间
       */

      /**
       * 重置表单
       */
      resetForm: function () {
        this.searchForm = {
          phone: '',
          start_createTime: '',
          end_createTime: '',
          tradeType: '',
          storeId: '',
          payWay: '',
          source: ''
        };
        this.changeDays();
        this.findRecordList(1, 10) //记录列表
      },

      /**
       * 检查日期
       */
      checkDays: function () {
        let s = this.searchForm.start_createTime;
        let e = this.searchForm.end_createTime;
        if (e != '') {

          if (s > e) {
            this.$message('开始日期不能晚于结束日期，已自动修改');
            this.searchForm.start_createTime = e - (60 * 60 * 24 * 1000)
          }

        }
      },

      /**
       * 修改日期范围
       */
      changeDays: function () {
        let timestamp = (new Date()).getTime();
        this.searchForm.start_createTime = '';
        this.searchForm.end_createTime = '';
        this.searchForm.start_createTime = timestamp - (60 * 60 * 24 * 7 * 1000);
        this.searchForm.end_createTime = timestamp

        //this.$message('日期选项已回到今日')
      },

      //时间格式化
      format(ts) {
        let time = new Date(ts);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        return y + '-' + this.add0(m) + '-' + this.add0(d)
      },
      /**
       * 深拷贝 防止对象污染用的
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
  /*public */

  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .rule_header {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .switch_tips {
    padding: 0 0 0 20px;
    font-size: 14px;
    color: #8b8b8b;
  }

  .switch_box {
    padding-top: 8px;

  }

  /*记录*/
  .list_header {

  }

  .card_group {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .card_item {
    border-radius: 5px;
    margin-right: 20px;
    width: 350px;
    height: 170px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    box-shadow: 0px 3px 12px 0 #ededed;
  }


  .card_line_1 {
    width: 100%;
    height: 85px;
    padding: 20px 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .card_line_2 {
    width: 100%;
    padding: 20px 40px;
    height: 85px;
    border-top: 1px dashed #c3d8ef;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .card_line_2 div p {
    font-size: 14px;
    color: #606060;
  }

  /*.tools_img {*/
  /*width: 30%;*/
  /*text-align: left;*/
  /*}*/

  .tools_text {
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

  .green {
    color: #1ab7ff !important;
  }


</style>
