<template>
  <div class="app-container" v-loading="loading">
    <!--搜索-->
    <div class="filter-container">
      <el-date-picker
        v-model="searchForm.startTime"
        type="date"
        :clearable="false"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <span>至</span>
      <el-date-picker
        v-model="searchForm.endTime"
        type="date"
        :clearable="false"
        placeholder="开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary" @click="mergeSearch">搜 索</el-button>
    </div>
    <el-divider content-position="left">营业信息统计</el-divider>
    <!--卡片数据-->
    <div class="card-info-box">

      <el-card class="card-info-item">
        <div class="card-info-title">订单数</div>
        <div class="card-info-value">{{totalData.orderAmount}}</div>
      </el-card>


      <el-card class="card-info-item">
        <div class="card-info-title">订单总额</div>
        <div class="card-info-value">￥{{totalData.tolMoney}}</div>
      </el-card>

    </div>

    <el-divider content-position="left">营业信息流水</el-divider>
    <!--表格-->
    <div>
      <template>
        <el-table
          :data="flowTableData"
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="consumeMoney"
            label="消费总额（元）">
          </el-table-column>
          <el-table-column
            prop="orderAmount"
            label="订单数">
          </el-table-column>
          <el-table-column
            prop="customerAmount"
            label="用餐人数">
          </el-table-column>
          <el-table-column
            prop="orderAverageConsume"
            label="单均消费（元）">
          </el-table-column>
          <el-table-column
            prop="customerAverageConsume"
            label="人均消费（元）">
          </el-table-column>
        </el-table>
        <pagination
          :total-elements="flowTableTotalElements"
          :change-callback="getFlowList"
          ref="page"></pagination>
      </template>
    </div>

  </div>
</template>

<script>
  import pagination from '@/components/pagination/index'
  import {getBusinessTotal, getBusinessList} from '../api/businessInfo'

  export default {
    name: "businessInfo",
    components: {pagination},
    data() {
      return {
        loading: false,//加载
        searchForm: {
          startTime: '',
          endTime: ''
        },
        totalData: {
          orderAmount: '',
          tolMoney: ''
        },
        flowTableData: [],//流水表格
        flowTableTotalElements: 0,//流水表格条数

      }
    },
    mounted() {
      //默认日期
      this.defaultDays();
      //获取经营统计信息
      this.getBusinessTotal();
      //获取列表
      this.getFlowList(1, 10);
      //第一次获取列表
      this.$refs['page'].refresh()
    },
    methods: {

      defaultDays: function () {
        let timestamp = (new Date()).getTime();
        this.$set(this.searchForm, 'startTime', this.format(timestamp - (24 * 60 * 60 * 1000 * 31)));
        this.$set(this.searchForm, 'endTime', this.format(timestamp))
      },

      /**
       * 联合搜索
       */
      mergeSearch: function () {
        //获取经营统计信息
        this.getBusinessTotal();
        //第一次获取列表
        this.getFlowList(1, 10)
      },

      /**
       * 获取经营数据
       */
      getBusinessTotal: function () {
        let st = this.searchForm.startTime;
        let et = this.searchForm.endTime;
        getBusinessTotal(st, et).then(res => {
          let data = res.obj;
          this.totalData.orderAmount = data.orderAmount; //订单数
          this.totalData.tolMoney = data.tolMoney; //订单总额
          //获取列表
        }).catch(e => {

        })
      },


      /**
       * 获取列表
       */
      getFlowList: function (pageNumber, pageSize) {
        let st = this.searchForm.startTime;
        let et = this.searchForm.endTime;
        getBusinessList(pageNumber, pageSize, st, et).then(res => {
          let data = res.obj;
          this.flowTableData = data.content;
          this.flowTableTotalElements = data.totalElement
        }).catch(e => {

        })
      },

      //时间格式化
      format(ts) {
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
      add0(m) {
        return m < 10 ? '0' + m : m
      },


    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .card-info-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;

    .card-info-item {
      margin-right: 20px;
      width: 300px;
      height: 100px;
      max-width: 100%;

      .card-info-title {
        width: 100%;
        max-width: 100%;
        line-height: 30px;

        font-size: 15px;
        color: #969696;
        text-align: center;
      }

      .card-info-value {
        width: 100%;
        max-width: 100%;

        font-size: 26px;
        color: #ff803e;
        text-align: center;
      }
    }
  }
</style>
