<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">
      <div class="header_bar">
        <div>
          <!--第一行功能条-->
          <div class="block">
            <el-input v-model="searchForm.orderNumber" placeholder="订单号" size="small" @input="submitSearch"></el-input>
          </div>
          <div class="block">
            <el-input v-model="searchForm.userName" placeholder="收银员" size="small" style="width: 120px"
                      @input="submitSearch"></el-input>
          </div>
          <!--<div class="block">-->
          <!--<el-input v-model="searchForm.qrName" placeholder="二维码名称" size="small" style="width: 120px"-->
          <!--@input="submitSearch"></el-input>-->
          <!--</div>-->

          <div class="block">
            <el-select v-if="userType==1" :clearable="false"
                       v-model="searchForm.storeId" placeholder="门店"
                       size="small" style="width: 200px"
                       @change="submitSearch">
              <el-option
                v-for="item in storeOption"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="block">
            <el-select v-model="searchForm.payWay"
                       clearable placeholder="支付方式"
                       size="small" style="width: 100px"
                       @change="submitSearch">
              <el-option
                v-for="item in payWayOption"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="block">
            <el-select v-model="searchForm.status"
                       clearable placeholder="订单状态"
                       size="small"
                       @change="submitSearch"
                       style="width: 100px">
              <el-option
                v-for="item in statusOption"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="block">
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
          </div>


        </div>

        <div class="line-2_btn">
          <!--第二行-->
          <el-button type="primary" @click="getOrderList()">查 询</el-button>
          <el-button @click="reset">重 置</el-button>
          <el-button @click="orderExport">导 出</el-button>
          <el-button @click="goBack">返 回</el-button>
        </div>

      </div>
    </el-card>

    <el-card class="box-card">
      <div content="total_view">
        <span class="little_title">订单总金额</span>
        <span class="little_content">{{totalCount.orderAmount}}元；</span>
        <span class="little_title">订单总数</span>
        <span class="little_content">{{totalCount.orderNum}}笔；</span>
        <span class="little_title">退款总金额</span>
        <span class="little_content">{{totalCount.refundAmount}}元；</span>
        <span class="little_title">退款总数</span>
        <span class="little_content">{{totalCount.refundNum}}笔；</span>
        <span class="little_title">优惠</span>
        <span class="little_content">{{totalCount.discountAmount}}元；</span>
        <span class="little_title">有效交易金额</span>
        <span class="little_content">{{totalCount.validAmount}}元；</span>
        <span class="little_title">手续费</span>
        <span class="little_content">{{totalCount.commission}}元；</span>
        <span class="little_title">实际营收</span>
        <span class="little_content">{{totalCount.realIncome}}元</span>
        <!-- <el-button size="mini" icon="el-icon-notebook-2" class="export_btn" @click="totalExport">导出汇总数据</el-button> -->
      </div>
    </el-card>

    <el-card class="box-card">
      <!--表格-->
      <div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            header-align="left"
            width="50">
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="订单号"
            width="170"
            show-overflow-tooltip>
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="storeName"-->
          <!--label="门店"-->
          <!--width="250px"-->
          <!--show-overflow-tooltip>-->
          <!--</el-table-column>-->
          <el-table-column
            prop="userName"
            label="收银员">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop=""-->
          <!--label="二维码名称">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="payTime"
            label="支付时间"
            width="200px">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="payWay"
            label="支付方式">
          </el-table-column>
          <el-table-column
            prop="actAmount"
            label="顾客实付">
          </el-table-column>
          <el-table-column
            prop="refundAmount"
            label="退款金额">
          </el-table-column>
          <el-table-column
            prop="validAmount"
            label="有效交易金额">
          </el-table-column>
          <el-table-column
            prop="commission"
            label="手续费">
          </el-table-column>
          <el-table-column
            prop="realIncome"
            label="实际营收">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="goDetail(scope.row.orderNum)"> 详细信息</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total-elements="tableTotalElement"
          :change-callback="getOrderList"
          ref="page"></pagination>
      </div>
    </el-card>


  </div>
</template>

<script>
  import {findOrderList, listExport, totalExport} from '../api/flowOrderList'
  import {url} from '@/utils/request'
  import {
    findOrderStatusOption,
    findOrderPayWayOption,
    findStoreOption
  } from '../api/public'
  import pagination from '@/components/pagination/index'

  export default {
    name: 'flowOrderList',
    components: {pagination},
    data() {
      return {
        loading: true,
        userType: 0,
        searchForm: {
          orderNumber: '',
          userName: '',
          qrName: '',
          storeId: '',
          days: [],
          payWay: '',
          status: '',
        },//搜索条件
        totalCount: {},
        storeOption: [],
        payWayOption: [],//支付方式选项
        statusOption: [],//订单状态选项
        tableData: [],//表格
        tableTotalElement: 0,//表格

        //之前一页搜索天数
        beforeSearchDays: ''
      }
    },
    mounted() {
      //获取URL参数
      this.userType = sessionStorage.getItem('userType');

      //获取时间，这样取到的是字符串 ，使用需要parseInt
      let st = this.$route.query.st || null;
      let et = this.$route.query.et || null;
      this.beforeSearchDays = this.$route.query.sd || null;

      //设置当前门店
      this.searchForm.storeId = this.$route.query.id === undefined ? '' : this.$route.query.id; //接收ID
      console.log(st, et);

      if (st && et) {
        this.urlDateSet(parseInt(st), parseInt(et))
      } else {
        this.changeDays(); //设置默认日期
      }


      this.getStatusOption(); //获取支付状态
      this.getPayWayOption(); //获取支付方式
      this.getStoreOption(); //获取门店下拉框选项

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
    computed: {
      //支付方式
      payWay: function (val) {
        return function (val) {
          let str = '未知';
          let pt = this.payWayOption;
          for (let i in pt) {
            if (pt[i].value == val) {
              str = pt[i].name;//赋值匹配名字
              break//停止循环
            }
          }
          return str
        }
      },
      //支付状态
      payStatus: function (val) {
        return function (val) {
          let str = '未知';
          let pt = this.statusOption;
          for (let i in pt) {
            if (pt[i].value == val) {
              str = pt[i].name;//赋值匹配名字
              break//停止循环
            }
          }
          return str
        }
      }

    },
    //方法
    methods: {
      /**
       * 日期赋值
       */
      urlDateSet: function (st, et) {
        console.log(typeof st, typeof et);

        this.$set(this.searchForm.days, 0, st);
        this.$set(this.searchForm.days, 1, et);
        this.getOrderList(1, 10)
      },


      /**
       * 导出
       */
      orderExport: function () {
        let orderNumber = this.searchForm.orderNumber;
        let userName = this.searchForm.userName;
        let storeId = this.searchForm.storeId;
        let payWay = this.searchForm.payWay;
        let status = this.searchForm.status;
        let st = this.format(this.searchForm.days[0]);
        let et = this.format(this.searchForm.days[1]);
        this.$confirm('是否导出' + st + '至' + et + "的流水列表？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          listExport(orderNumber, userName, storeId, payWay, status, st, et).then(res => {
            console.log(res);

            let a = document.createElement('a');
            let companyName = sessionStorage.getItem('name') || '';
            let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
            let objectUrl = URL.createObjectURL(blob);
            a.setAttribute("href", objectUrl);
            a.setAttribute("download", `${companyName}_${st}_${et}_流水列表`);
            a.click();

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
       * 导出统计
       */
      totalExport: function () {
        let source = this.totalCount;
        let form = {};

        form.orderAmount = source.orderAmount;
        form.orderNum = source.orderNum;
        form.refundAmount = source.refundAmount;
        form.refundNum = source.refundNum;
        form.validAmount = source.validAmount;
        form.discountAmount = source.discountAmount;
        form.commission = source.commission;
        form.realIncome = source.realIncome;
        form.storeId = this.searchForm.storeId;
        form.startTime = this.format(this.searchForm.days[0]);
        form.endTime = this.format(this.searchForm.days[1]);



        totalExport(form).then(res => {
          let a = document.createElement('a');
          let companyName = sessionStorage.getItem('name') || '';
          let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
          let objectUrl = URL.createObjectURL(blob);
          a.setAttribute("href", objectUrl);
          a.setAttribute("download", `汇总数据`);
          a.click();
        }).catch(e => {
          this.$message.error('列表获取错误')
        })
      },
      /**
       * 获取支付状态
       */
      getStatusOption: function () {
        findOrderStatusOption().then(res => {
          // console.log(res)
          let ops = res.obj;
          for (let op of ops) {
            if (op.value != '1' && op.value != '3' && op.value != '4') {
              this.statusOption.push(op);
            }
          }
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
       * 获取门店
       */
      getStoreOption: function () {
        findStoreOption().then(res => {
          // console.log(res)
          this.storeOption = res.obj
        }).catch(e => {
          this.$message.error('门店选项无法获取')
        })
      },

      /**
       * 发起搜索
       */
      submitSearch: function () {
        this.getOrderList(1, 10)
      },

      /**
       *获取订单列表
       */
      getOrderList: function (pageNumber, pageSize) {
        let pn = pageNumber == undefined ? 1 : pageNumber;
        let ps = pageSize == undefined ? 10 : pageSize;
        let orderNumber = this.searchForm.orderNumber;
        let userName = this.searchForm.userName;
        let storeId = this.searchForm.storeId;
        let payWay = this.searchForm.payWay;
        let status = this.searchForm.status;


        let st_source = this.searchForm.days[0];
        let et_source = this.searchForm.days[1];

        let st = this.format(st_source);
        let et = this.format(et_source);
        findOrderList(pn, ps, orderNumber, userName, storeId, payWay, status, st, et).then(res => {
          let data = res.obj;
          this.tableData = data.listData;
          this.totalCount = data.totalCount;
          this.tableTotalElement = data.totalElement;
          this.loading = false
        }).catch(e => {
          this.$message.error('列表获取错误')
        })
      },
      /**
       *跳转详情
       */
      goDetail: function (data) {
        console.log(data);
        this.$router.push({path: '/pay/views/flowOrderDetail', query: {id: data}})
      },

      /**
       *检查时间
       * 如果不对，则修改为里结束日期的前90天。
       */
      checkDataRange() {
        let timestamp = (new Date()).getTime();
        if (this.searchForm.days == null) {
          this.searchForm.days = [];
          this.searchForm.days[0] = timestamp;
          this.searchForm.days[1] = timestamp;
          this.$message('日期选项已回到今日');
          return
        }
        let startTime = this.searchForm.days[0];
        let endTime = this.searchForm.days[1];
        if (endTime - startTime > 24 * 60 * 60 * 1000 * 90) {
          this.$message.error('前后时间不能超过90天');
          this.$set(this.searchForm.days, 0, timestamp - (24 * 60 * 60 * 1000 * 90));
          this.$set(this.searchForm.days, 1, timestamp)
        }
      },
      /**
       * 修改日期
       * @param event 日期范围选项
       */
      changeDays: function () {
        let timestamp = (new Date()).getTime();
        let startTime = new Date(new Date().toLocaleDateString()) - (24 * 60 * 60 * 1000 * 6);
        let endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
        this.$set(this.searchForm.days, 0, startTime);
        this.$set(this.searchForm.days, 1, endTime);
        this.getOrderList(1, 10)
      },

      /**
       * reset重置
       */
      reset: function () {
        this.searchForm.orderNumber = '';
        this.searchForm.orderNumber = '';
        this.searchForm.userName = '';
        this.searchForm.qrName = '';
        this.searchForm.days = [];
        this.searchForm.payWay = '';
        this.searchForm.status = '';

        let timestamp = (new Date()).getTime();
        let startTime = timestamp - (24 * 60 * 60 * 1000 * 6);
        let endTime = timestamp;
        this.$set(this.searchForm.days, 0, startTime);
        this.$set(this.searchForm.days, 1, endTime);

        this.submitSearch()
      },

      /**
       * 工具
       * @param ts 时间戳
       * @returns {string} 格式化事时间
       */
      //时间格式化
      format(ts) {

        let time = new Date(ts);
        console.log(time);
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

      /**
       * 退出
       */
      goBack: function () {
        // this.$router.go('-1')
        let st = this.searchForm.days[0] || '';
        let et = this.searchForm.days[1] || '';
        let sd = this.beforeSearchDays || '';
        this.$router.push({path: '/pay/views/flowPreview', query: {st: st, et: et, sd: sd}})

      }

    }
  }
</script>

<style scoped>
  .block {
    display: inline-block;
    vertical-align: middle;
  }

  .box-card {
    margin: 0 0 10px 0;
  }

  .line-2_btn {
    margin-top: 5px;
  }

  .total_view {
    width: 100%;
  }

  .little_title {
    font-weight: bold;
    margin: 0 10px 0 0;
    font-size: 14px;
    color: #6e6e6e;
  }

  .little_title:after {
    content: ':';
  }

  .little_content {
    font-size: 14px;
    margin: 0 5px 0 0;
    color: #3A3A3A;
  }

  .export_btn {
    margin-left: 50px;
  }
</style>
