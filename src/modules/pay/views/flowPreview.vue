<template>
  <div class="app-container" v-loading="loading">
    <div>

      <el-card class="box-card">

        <div slot="header" class="clearfix">
          <span>流水概览</span>
        </div>

        <!--功能区-->

        <div>
          <!--搜索条-->
          <div>
            <div class="search_bar">
              <div>
                <!--上方选项-->
                <div>
                  <!--选项条-->
                  <div class="block">
                    <el-radio-group v-model="searchDays" size="medium" @change="changeDays($event)">
                      <el-radio-button label="0">近7日</el-radio-button>
                      <el-radio-button label="1">近15日</el-radio-button>
                      <el-radio-button label="2">近30日</el-radio-button>
                    </el-radio-group>
                  </div>
                  <!--日期选择-->
                  <div class="block">
                    <el-date-picker
                      @change="checkDataRange"
                      v-model="searchForm.days"
                      :clearable="false"
                      type="datetimerange"
                      range-separator="-"
                      start-placeholder="开始日期时间"
                      end-placeholder="结束日期时间"
                      value-format="timestamp"
                      :default-time="['00:00:00', '23:59:59']"
                      size="medium">
                    </el-date-picker>
                  </div>


                  <!--按钮-->
                  <div class="block">
                    <el-button type="primary" size="medium" @click="findCountData" style="margin-left: 10px">搜 索
                    </el-button>
                    <el-button type="" size="medium" @click="reset">重 置</el-button>
                  </div>
                </div>
                <!--下方选项-->
                <div style="margin-top: 10px">

                </div>
              </div>
            </div>
          </div>
        </div>
        <!--卡片区-->
        <div>
          <div class="card_group">
            <!--订单金额-->
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/pay/icon/订单金额.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>订单金额
                      <el-tooltip class="item" effect="light" content="订单的总金额，不包含任何退款和优惠。" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>￥{{cardData.orderAmount}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <!--订单总数-->
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/pay/icon/订单总数.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>有效订单总数
                      <el-tooltip class="item" effect="light" content="支付成功订单数量总和（包含部分退款和全额退款）。" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>{{cardData.orderTotal}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <!--退款金额-->
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/pay/icon/退款金额.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>退款金额
                      <el-tooltip class="item" effect="light" content="每笔订单退款金额总和。" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>￥{{cardData.refundAmount}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <!--退款总数-->
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/pay/icon/退款总数.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>退款总数
                      <el-tooltip class="item" effect="light" content="退款订单数量总和。" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>{{cardData.refundCount}}</p>
                  </div>
                </div>
              </el-card>
            </div>

            <!--商户实收-->
            <!--<div class="card_item">-->
            <!--<el-card class="box-card">-->
            <!--<div class="text item tools_box">-->
            <!--<div class="tools_img">-->
            <!--<img src="../../../assets/images/pay/icon/商户实收.png" alt="">-->
            <!--</div>-->
            <!--<div class="tools_text">-->
            <!--<p>商户实收-->
            <!--<el-tooltip class="item" effect="light" content="商户实际到账金额总和。" placement="top-start">-->
            <!--<i class="el-icon-info"></i>-->
            <!--</el-tooltip>-->
            <!--</p>-->
            <!--<p>￥{{cardData.settlementTotalFee}}</p>-->
            <!--</div>-->
            <!--</div>-->
            <!--</el-card>-->
            <!--</div>-->
            <!--&lt;!&ndash;商户实退&ndash;&gt;-->
            <!--<div class="card_item">-->
            <!--<el-card class="box-card">-->
            <!--<div class="text item tools_box">-->
            <!--<div class="tools_img">-->
            <!--<img src="../../../assets/images/pay/icon/商户实退.png" alt="">-->
            <!--</div>-->
            <!--<div class="tools_text">-->
            <!--<p>商户实退-->
            <!--<el-tooltip class="item" effect="light" content="商户实际退款金额总和。" placement="top-start">-->
            <!--<i class="el-icon-info"></i>-->
            <!--</el-tooltip>-->
            <!--</p>-->
            <!--<p>￥{{cardData.settlementRefundFee}}</p>-->
            <!--</div>-->
            <!--</div>-->
            <!--</el-card>-->
            <!--</div>-->


          </div>
          <div class="card_group">
            <!--顾客实付-->
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/pay/icon/顾客实付.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>有效交易金额
                      <el-tooltip class="item" effect="light" content="有效交易金额 = 订单金额 - 优惠金额 - 退款金额。"
                                  placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>￥{{cardData.realPayAmount}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <!--手续费-->
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/pay/icon/其他优惠.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>手续费
                      <el-tooltip class="item" effect="light" content="订单产生的手续费总和。" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>￥{{cardData.commission}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <!--实际营收-->
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/pay/icon/实际营收.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>实际营收
                      <el-tooltip class="item" effect="light" content="实际营收 = 顾客实付 - 手续费，由于各渠道差异，该数据可能产生偏差。"
                                  placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>￥{{cardData.actualRevenue}}</p>
                  </div>
                </div>
              </el-card>
            </div>
            <!--商户优惠-->
            <div class="card_item">
              <el-card class="box-card">
                <div class="text item tools_box">
                  <div class="tools_img">
                    <img src="../../../assets/images/pay/icon/商户优惠.png" alt="">
                  </div>
                  <div class="tools_text">
                    <p>商户优惠
                      <el-tooltip class="item" effect="light" content="商户实际出资的优惠金额总和。" placement="top-start">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </p>
                    <p>￥{{cardData.merchantDiscount}}</p>
                  </div>
                </div>
              </el-card>
            </div>


          </div>
          <div class="card_group">
          </div>
        </div>
        <!--图表区-->
        <div>
          <div class="data_chart">


            <el-card class="box-card chart_card_left">
              <el-tabs class="left_tabs" v-model="leftActiveName" @tab-click="leftChangeTabs">
                <el-tab-pane :name="item.value" v-for="(item,index) in leftChartMenu" :key="`lc${index}`">
                  <span slot="label">{{(item.name).split('&')[0]}}
                    <el-tooltip class="item" effect="light" :content="(item.name).split('&')[1]" placement="top">
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <div :id="`left_chart${item.value}`" class="chart_img"
                       v-loading="leftDataNull"
                       element-loading-text="没有数据"
                       element-loading-spinner="el-icon-view"
                       element-loading-background="rgba(255, 255, 255, 1)">
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>


            <el-card class="box-card chart_card_right">
              <el-tabs v-model="rightActiveName" @tab-click="rightChangeTabs">
                <el-tab-pane :label="item.name" :name="item.value" v-for="(item,index) in rightChartMenu"
                             :key="`rc${index}`">
                  <div :id="`right_chart${item.value}`" class="chart_img"
                       v-loading="rightDataNull"
                       element-loading-text="没有数据"
                       element-loading-spinner="el-icon-view"
                       element-loading-background="rgba(255, 255, 255, 1)">
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>

          </div>
        </div>
        <!--表格区-->
        <div>
          <el-card class="box-card table_box">
            <!--商户-->
            <el-tabs v-model="tableActiveName" v-if="userType==1" @tab-click="changeStoreTable">
              <el-tab-pane label="门店流水统计" name="1">
                <el-table
                  :data="storeFlowTable"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号"
                    header-align="left"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="storeName"
                    label="门店"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="orderNum"
                    label="有效订单数">
                  </el-table-column>
                  <el-table-column
                    prop="orderAmount"
                    label="订单金额">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.orderAmount" placement="top">
                        <span>订单金额<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="refundAmount"
                    label="退款金额">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.refundAmount" placement="top">
                        <span>退款金额<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="discountAmount"
                    label="优惠金额">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.discountAmount" placement="top">
                        <span>优惠金额<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="validAmount"
                    label="有效交易金额">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.validAmount" placement="top">
                        <span>有效交易金额<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="commission"
                    label="手续费">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.commission" placement="top">
                        <span>手续费<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="realIncome"
                    label="实际营收">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.realIncome" placement="top">
                        <span>实际营收<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                      <el-button type="primary" size="small" @click="goDetailByStore(scope.row.storeId)"> 详细信息
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                  :total-elements="storeFlowTotalElement"
                  :change-callback="getStoreList"
                  ref="page"></pagination>
              </el-tab-pane>
            </el-tabs>
            <!--店长-->
            <el-tabs v-model="tableActiveName" v-if="userType==2 || userType==3" @tab-click="changeMasterTable">
              <el-tab-pane label="收银员流水统计" name="1">
                <!--流水统计 (订单)-->
                <el-table
                  :data="cashierFlowTable"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="orderNum"
                    label="订单号">
                  </el-table-column>
                  <el-table-column
                    prop="userName"
                    label="收银员">
                  </el-table-column>
                  <el-table-column
                    prop="payWay"
                    label="支付方式">
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    label="状态">
                  </el-table-column>
                  <el-table-column
                    prop="payTime"
                    label="支付时间">
                  </el-table-column>
                  <el-table-column
                    prop="actAmount"
                    label="顾客实付">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.actAmount" placement="top">
                        <span>顾客实付<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="refundAmount"
                    label="退款金额">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.refundAmount" placement="top">
                        <span>退款金额<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="validAmount"
                    label="有效交易金额">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.validAmount" placement="top">
                        <span>有效交易金额<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="commission"
                    label="手续费">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.commission" placement="top">
                        <span>手续费<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="realIncome"
                    label="实际营收">
                    <!--帮助提示-->
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="tooltip.realIncome" placement="top">
                        <span>实际营收<i class="el-icon-question"></i></span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="small" @click="goDetailByOrder(scope.row.orderNum)">查看详情
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <!--流水统计-->
                <pagination
                  :total-elements="cashierFlowTotalElement"
                  :change-callback="getOrderList"
                  ref="page"></pagination>
              </el-tab-pane>
              <!--<el-tab-pane label="二维码流水统计" name="2">-->
              <!--<el-table-->
              <!--:data="qrFlowTable"-->
              <!--style="width: 100%">-->
              <!--<el-table-column-->
              <!--type="index"-->
              <!--label="序号"-->
              <!--width="50">-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
              <!--prop="name"-->
              <!--label="二维码"-->
              <!--width="180">-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
              <!--prop="num"-->
              <!--label="订单数">-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
              <!--prop="price"-->
              <!--label="订单金额">-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
              <!--prop="act"-->
              <!--label="商户实收">-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
              <!--prop="actRe"-->
              <!--label="商户实退">-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
              <!--label="操作">-->
              <!--<template slot-scpoe="scpoe">-->
              <!--<el-button type="primary" size="small">查看详情</el-button>-->
              <!--</template>-->
              <!--</el-table-column>-->
              <!--</el-table>-->
              <!--</el-tab-pane>-->
            </el-tabs>
          </el-card>
        </div>
      </el-card>
    </div>


  </div>
</template>

<script>
  import {
    findCountData,
    findLeftChart,
    findRightChart,
    findStoreList,
    findOrderList,
    findOrderStatusOption,
    findOrderPayWayOption,
    getLeftChartMenu,
    getRightChartMenu,
  } from '../api/flowPreview'
  import pagination from '@/components/pagination/index'

  export default {
    name: 'flowPreview',
    components: {pagination},
    data() {
      return {
        loading: true,
        userType: '',//登录用户类型
        searchDays: '0',//搜索天数
        searchForm: {
          days: [],//日期
          type: '2'//类型
        },
        cardData: {},//卡片数据
        leftActiveName: '0', //左侧图表标签页Index
        rightActiveName: '0', //右侧图表标签页Index
        tableActiveName: '1',//表格标签页
        leftDataNull: true,
        rightDataNull: true,

        //usertype=1 商户 只看门店流水
        storeFlowTable: [], //门店流水表格
        storeFlowTotalElement: 0, //门店流水表格总条数
        // usertype=2 店长 只看员工和二维码流水
        cashierFlowTable: [], //收银员流水表格
        cashierFlowTotalElement: 0, //收银员流水表格总条数
        qrFlowTable: [], //二维码流水表格
        qrFlowTotalElement: 0, //二维码流水表格总条数

        statusOption: [],
        payWayOption: [],


        //动态菜单
        leftChartMenu: [],
        rightChartMenu: [],

        //help 帮助文本
        tooltip: {
          realIncome: '有效交易金额 - 手续费',//实际营收
          actAmount: '订单金额 - 优惠金额 - 退款金额',//顾客实付
          refundAmount: '退款金额',//退款金额
          validAmount: '订单金额 - 优惠金额 - 退款金额',//有效交易金额
          commission: '订单手续费总和',//手续费
          orderAmount: '订单的总金额，不包含任何退款和优惠',//订单金额
          discountAmount: '优惠金额',//优惠金额
        }

      }
    },
    filters: {
      //流水状态
      statusFil: function (val) {
        let v = parseInt(val);
        let txt = '';
        switch (v) {
          case 1:
            txt = '未支付';
            break;
          case 2:
            txt = '支付成功';
            break;
          case 3:
            txt = '支付失败';
            break;
          case 4:
            txt = '已撤销';
            break;
          case 5:
            txt = '全额退款成功';
            break;
          case 6:
            txt = '部分退款成功';
            break;
          case 7:
            txt = '退款失败';
            break;
          default:
            txt = '未知';
            break
        }
        return txt
      },
      //流水状态
      payWayFil: function (val) {
        let v = parseInt(val);
        let txt = '';
        switch (v) {
          case 1:
            txt = '微信';
            break;
          case 2:
            txt = '支付宝';
            break;
          case 3:
            txt = '银行卡';
            break;
          case 4:
            txt = '会员卡';
            break;
          default :
            txt = '未知'
        }
        return txt
      }
    },
    mounted() {
      this.userType = sessionStorage.getItem('userType');

      this.getLeftChartMenu();
      this.getRightChartMenu();

      //获取时间
      let st = this.$route.query.st || null;
      let et = this.$route.query.et || null;
      let sd = this.$route.query.sd || 0;
      this.searchDays = sd + '';
      if (st && et) {
        this.urlDateSet(st, et);
        this.findCountData()
      } else {
        //默认查询
        this.defaultSearch()
      }


    },
    methods: {
      /**
       * 日期赋值
       */
      urlDateSet: function (st, et) {
        console.log(st, et);
        if (st && et) {
          this.$set(this.searchForm, 'days', [st, et])
        }
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
       * 获取左侧图表菜单
       */
      getLeftChartMenu: function () {
        getLeftChartMenu().then(res => {
          let data = res.obj;
          this.leftChartMenu = data
        }).catch(e => {

        })
      },
      /**
       * 获取右侧图表菜单
       */
      getRightChartMenu: function () {
        getRightChartMenu().then(res => {
          let data = res.obj;
          this.rightChartMenu = data
        }).catch(e => {

        })
      },


      /**
       * 第一次默认查询
       */
      defaultSearch() {
        //设定7天日期//2
        this.changeDays(0)
      },

      /**
       *检查时间
       * 如果不对，则修改为里结束日期的前31天。
       */
      checkDataRange() {
        console.log(this.searchForm.days);
        if (this.searchForm.days == null) {
          this.$set(this.searchForm, 'days', []);
          return
        }
        let timestamp = (new Date()).getTime();
        let startTime = this.searchForm.days[0];
        let endTime = this.searchForm.days[1];
        if (endTime - startTime > 24 * 60 * 60 * 1000 * 90) {
          this.$message.error('前后时间不能超过90天');
          this.$set(this.searchForm.days, 0, timestamp - (24 * 60 * 60 * 1000 * 90));
          this.$set(this.searchForm.days, 1, timestamp)
        } else if (endTime > timestamp) {
          this.$message.error('日期不能大于当天');
          this.$set(this.searchForm.days, 1, timestamp)
        }
      },
      /**
       * 快捷方式修改日期
       * @param event 日期范围选项
       */
      changeDays: function (event) {
        let timestamp = (new Date()).getTime();
        // 0=7  1=15 2=30
        if (event == 0) {
          //当日0点
          this.$set(this.searchForm.days, 0, new Date(new Date().toLocaleDateString()).getTime() - (24 * 60 * 60 * 1000 * 6));
          this.$set(this.searchForm.days, 1, new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
        } else if (event == 1) {
          let startTime = new Date(new Date().toLocaleDateString()) - (24 * 60 * 60 * 1000 * 14);
          let endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
          this.$set(this.searchForm.days, 0, startTime);
          this.$set(this.searchForm.days, 1, endTime)
        } else if (event == 2) {
          let startTime = new Date(new Date().toLocaleDateString()).getTime() - (24 * 60 * 60 * 1000 * 30);
          let endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
          this.$set(this.searchForm.days, 0, startTime);
          this.$set(this.searchForm.days, 1, endTime)
        }
        //获取卡片数据
        this.findCountData();
      },

      /**
       * 获取卡片数据 后 获取图表数据
       */
      findCountData: function () {
        let st = this.format(this.searchForm.days[0]) || '';
        let et = this.format(this.searchForm.days[1]) || '';

        findCountData(st, et).then(res => {
          this.cardData = res.obj;
          this.loading = false;

          this.leftChangeTabs(); //为左边图表获取数据
          this.rightChangeTabs(); //为右边图表获取数据
          //获取列表数据(分流检查)
          this.getListCheck()
        }).catch(e => {

        })
      },
      /**
       * 获取列表 判断用户
       */
      getListCheck: function () {
        if (this.userType == 1) {
          this.getStoreList(1, 10)
        } else if (this.userType == 2 || this.userType == 3) {
          this.getOrderList(1, 10)
        }
      },

      /**
       * 获取门店列表
       */
      getStoreList: function (pageNum, pageSize) {
        let st = this.format(this.searchForm.days[0]) || '';
        let et = this.format(this.searchForm.days[1]) || '';
        findStoreList(pageNum, pageSize, st, et).then(res => {
          let data = res.obj;
          this.storeFlowTable = data.listData;
          this.storeFlowTotalElement = data.totalElement

        }).catch(e => {

        })
      },

      /**
       * 获取列表
       */
      getOrderList: function (pageNum, pageSize) {
        let st = this.format(this.searchForm.days[0]) || '';
        let et = this.format(this.searchForm.days[1]) || '';
        findOrderList(pageNum, pageSize, st, et).then(res => {
          let data = res.obj;
          this.cashierFlowTable = data.listData;
          this.cashierFlowTotalElement = data.totalElement
        }).catch(e => {

        })

      },

      /**
       *跳转详情
       */
      goDetailByStore: function (data) {
        console.log(data);
        let st = this.searchForm.days[0] || '';
        let et = this.searchForm.days[1] || '';
        let sd = this.searchDays || '0';
        this.$router.push({path: '/pay/views/flowOrderList', query: {id: data, st: st, et: et, sd: sd}})
      },
      /**
       *跳转详情
       */
      goDetailByOrder: function (data) {
        console.log(data);
        this.$router.push({path: '/pay/views/flowOrderDetail', query: {id: data}})
      },

      /**
       * 切换左的图表标签页---------------------------------------------------
       */
      leftChangeTabs() {
        let st = this.format(this.searchForm.days[0]) || '';
        let et = this.format(this.searchForm.days[1]) || '';
        let type = this.leftActiveName || 0;
        //发起查询
        this.findLeftChart(st, et, type)

      },

      /**
       *获取图表数据
       */
      findLeftChart: function (st, et, type) {
        findLeftChart(st, et, type).then(res => {
          if (res.obj != null) {
            this.drawChartLeftOne(res.obj, type);
            this.leftDataNull = false
          }
        }).catch(e => {
          this.leftDataNull = true
        })
      },

      /**
       * 渲染图表 左
       */
      drawChartLeftOne: function (data, type) {
        let x1 = data.xdata; //日期
        let y1 = data.ydata; //金额
        let y2 = data.num; //数量
        var chart = this.$echarts.init(document.getElementById(`left_chart${type}`));
        chart.setOption({

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['金额', '数量']
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
            data: x1
          },//X轴标题
          yAxis: [
            {name: '金额', type: 'value'},
            {name: '数量', type: 'value'},
          ],
          series: [{
            data: y1,
            name: '金额',
            type: 'line',
            smooth: true,
            yAxisIndex: 0,
            tooltip: {
              trigger: 'axis'
            },
            areaStyle: {},
            itemStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: 'rgb(255,128,62)'},  //0%处的颜色
                    {offset: 0.5, color: 'rgb(255,128,62)'},//50%处的颜色
                    {offset: 0.9, color: 'rgb(255,128,62)'}  //100%处的颜色
                  ]
                )
              }
            }
          },
            {
              data: y2,
              name: '数量',
              type: 'line',
              smooth: true,
              yAxisIndex: 1,
              tooltip: {
                trigger: 'axis'
              },
              areaStyle: {},
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: 'rgb(255,230,143)'},  //0%处的颜色
                      {offset: 0.5, color: 'rgb(255,230,143)'},//50%处的颜色
                      {offset: 0.9, color: 'rgb(255,230,143)'}  //100%处的颜色
                    ]
                  )
                }
              }
            },
          ] //数据数组，多个数据，legend需要对于标题name
        })
      },

      /**
       * 切换右的图表标签页---------------------------------------------------
       */
      rightChangeTabs() {
        let st = this.format(this.searchForm.days[0]) || '';
        let et = this.format(this.searchForm.days[1]) || '';
        let type = this.rightActiveName || 0;
        this.findRightChart(st, et, type)
      },
      /**
       *获取订单状态
       */
      findRightChart: function (st, et, type) {
        findRightChart(st, et, type).then(res => {
          if (res.obj != null) {
            this.drawChartRightOne(res.obj, type);
            this.rightDataNull = false
          }
        }).catch(e => {
          this.rightDataNull = true
        })
      },

      /**
       * 渲染图表 右1
       */
      drawChartRightOne: function (data, type) {
        let title = [];
        for (let i in data) {
          title.push(data[i].name)
        }
        let tips = this.rightChartMenu;
        var chart = this.$echarts.init(document.getElementById(`right_chart${type}`));
        chart.setOption({
          color: ['rgb(255,128,62)', '#FE9E7F', '#e2d043', '#FFE68F'],    //设置每个图例的颜色
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            data: title
          },
          series: [
            {
              name: tips[this.rightActiveName].name,
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: data
            }
          ]
        })
      },


      /**
       * 切换表格（商户角色）---------------------------------------------------
       */
      changeStoreTable: function () {

      },
      /**
       * 切换表格（店长角色）
       */
      changeMasterTable: function () {

      },

      /**
       * reset 重置
       */

      reset: function () {
        let timestamp = (new Date()).getTime();
        let startTime = timestamp;
        let endTime = timestamp;
        this.searchDays = '0';
        this.$set(this.searchForm.days, 0, startTime);
        this.$set(this.searchForm.days, 1, endTime)
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
        let hour = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();
        // return y + '-' + this.add0(m) + '-' + this.add0(d)
        return `${y}-${this.add0(m)}-${this.add0(d)} ${this.add0(hour)}:${this.add0(minute)}:${this.add0(second)}`
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
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .search_bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  /*卡片*/
  .card_group {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }

  .card_item {
    padding: 0;
    width: 23%;
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
  .data_chart {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .chart_card_left {
    width: 59%;
  }

  .chart_card_right {
    width: 39%;
  }

  .chart_img {
    width: 100%;
    height: 500px;
  }

  /*表格*/
  .table_box {
    margin-top: 20px;
  }
</style>
