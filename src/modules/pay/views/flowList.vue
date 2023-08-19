<template>
  <div class="app-container" v-loading="loading">


    <el-card class="box-card">
      <div class="header_bar">
        <div>
          <!--第一行功能条-->
          <div class="block">
            <el-date-picker
              @change="checkDataRange"
              v-model="searchForm.days"
              type="daterange"
              range-separator="~"
              start-placeholder="开始"
              end-placeholder="结束"
              format="yyyy年MM月dd"
              value-format="timestamp">
            </el-date-picker>
          </div>

          <div class="block">
            <el-select v-model="searchForm.payWay" placeholder="支付方式"
                       clearable
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
            <el-select v-model="searchForm.status" placeholder="订单状态"
                       clearable
                       @change="submitSearch">
              <el-option
                v-for="item in statusOption"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

        </div>

        <div class="line-2_btn">
          <!--第二行-->
          <el-button type="primary" @click="submitSearch">查 询</el-button>
          <el-button @click="reset">重 置</el-button>
          <el-tooltip class="item" effect="dark" content="开发中" placement="right">
            <el-button>导 出</el-button>
          </el-tooltip>
        </div>

      </div>
    </el-card>


    <el-card class="box-card">
      <div content="total_view">
        <span class="little_title">订单总数</span>
        <span class="little_content">{{totalCount.orderNum}}笔；</span>
        <span class="little_title">订单总金额</span>
        <span class="little_content">{{totalCount.orderAmount}}元；</span>
        <span class="little_title">退款总金额</span>
        <span class="little_content">{{totalCount.refundAmount}}元；</span>
        <span class="little_title">顾客实付</span>
        <span class="little_content">{{totalCount.customerPaidAmount}}元；</span>
        <span class="little_title">优惠</span>
        <span class="little_content">{{totalCount.discountAmount}}元</span>
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
            prop="storeName"
            label="门店"
            width="250"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="有效订单数">
          </el-table-column>
          <el-table-column
            prop="orderAmount"
            label="订单金额（￥）">
          </el-table-column>
          <el-table-column
            prop="refundAmount"
            label="退款金额（￥）">
          </el-table-column>
          <el-table-column
            prop="customerPaidAmount"
            label="顾客实付（￥）">
          </el-table-column>
          <el-table-column
            prop="discountAmount"
            label="优惠（￥）">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="goDetail(scope.row.storeId)"> 详细信息</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total-elements="tableTotalElement"
          :change-callback="getList"
          ref="page"></pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
  import {findStoreList} from '../api/flowList'
  import {
    findOrderStatusOption,
    findOrderPayWayOption,
  } from '../api/public'
  import pagination from '@/components/pagination/index'

  export default {
    name: 'flowList',
    components: {pagination},
    data () {
      return {
        loading: true,
        userType: 0,//用户类型
        searchForm: {
          days: [],
          payWay: '',
          status: '',
        },//搜索条件
        payWayOption: [],//支付方式选项
        statusOption: [],//订单状态选项
        totalCount: {},//汇总信息
        tableData: [],//表格
        tableTotalElement: 0,//表格

      }
    },
    created () {
      var userType = sessionStorage.getItem('userType')//获取用户类型

      if (userType == 2) {
        this.toOrderList()
      }

    },
    //周期钩子
    mounted () {
      this.getStatusOption() //获取支付状态
      this.getPayWayOption() //获取支付方式

      this.userType = sessionStorage.getItem('userType')//获取用户类型

      this.changeDays() //设置默认日期
      this.submitSearch() //发起默认搜索
    },
    //方法
    methods: {
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
       * 如果用户是店长
       * 则直接跳转到订单列表
       */
      toOrderList: function () {
        console.warn('2')
        this.$router.push({path: '/pay/views/flowOrderList'})
      },

      /**
       *跳转详情
       */
      goDetail: function (data) {
        console.log(data)
        this.$router.push({path: '/pay/views/flowOrderList', query: {id: data}})
      },
      /**
       * 发起搜索
       */
      submitSearch: function () {
        this.getList(1, 10)
      },

      /**
       * 获取列表
       */
      getList: function (pageNumber, pageSize) {
        let payWay = this.searchForm.payWay
        let status = this.searchForm.status
        let st = this.format(this.searchForm.days[0])
        let et = this.format(this.searchForm.days[1])

        findStoreList(pageNumber, pageSize, payWay, status, st, et).then(res => {
          console.log(res)
          let data = res.obj
          this.totalCount = data.totalCount
          this.tableTotalElement = data.totalElement
          this.tableData = data.listData
          this.loading = false
        }).catch(r => {
          this.$message.error('门店列表获取失败')
        })
      },

      /**
       *检查时间
       * 如果不对，则修改为里结束日期的前31天。
       */
      checkDataRange () {
        let timestamp = (new Date()).getTime()

        if (this.searchForm.days == null) {
          this.searchForm.days = new Array
          this.searchForm.days[0] = timestamp
          this.searchForm.days[1] = timestamp
          this.$message('日期选项已回到今日')
          return
        }
        let startTime = this.searchForm.days[0]
        let endTime = this.searchForm.days[1]
        if (endTime - startTime > 24 * 60 * 60 * 1000 * 31) {
          this.$message.error('前后时间不能超过31天')
          this.$set(this.searchForm.days, 0, timestamp - (24 * 60 * 60 * 1000 * 31))
          this.$set(this.searchForm.days, 1, timestamp)
        }
      },
      /**
       * 修改日期
       * @param event 日期范围选项
       */
      changeDays: function () {
        let timestamp = (new Date()).getTime()
        let startTime = new Date(new Date().toLocaleDateString()) - (24 * 60 * 60 * 1000*6);;
        let endTime = new Date(new Date().toLocaleDateString()).getTime()+ 24 * 60 * 60 * 1000 - 1;
        this.$set(this.searchForm.days, 0, startTime)
        this.$set(this.searchForm.days, 1, endTime)
      },

      /**
       * reset 重置搜索
       */
      reset: function () {
        this.searchForm = {
          days: [],
          payWay: '',
          status: '',
        }//重置搜索条件

        this.changeDays()
        this.submitSearch()
      },
      /**
       * 工具
       * @param ts 时间戳
       * @returns {string} 格式化事时间
       */
      //时间格式化
      format (ts) {
        let time = new Date(ts)
        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        return y + '-' + this.add0(m) + '-' + this.add0(d)
      },

      /**
       * 补充0
       * @param  m 月和日，补齐2位
       * @returns {string} 补齐2二位后的时间
       */
      add0 (m) {
        return m < 10 ? '0' + m : m
      },

    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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

  .header_bar {

  }

  .content {
    margin-top: 10px;

  }

  .total_view {
    margin-top: 10px;
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
    margin: 0 5px 0 0;
    font-size: 14px;
    color: #3A3A3A;

  }
</style>
