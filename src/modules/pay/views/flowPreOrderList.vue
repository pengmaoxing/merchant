<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">
      <div class="header_bar">
        <div>

          <!--选项条-->
          <div class="block">
            <el-radio-group v-model="searchDays" size="small" @change="changeDays($event)">
              <el-radio-button label="0">今日</el-radio-button>
              <el-radio-button label="1">昨日</el-radio-button>
              <el-radio-button label="2">近7日</el-radio-button>
            </el-radio-group>
          </div>
          <div class="block">
            <el-date-picker
              @change="checkDataRange"
              v-model="searchForm.days"
              type="daterange"
              start-placeholder="开始"
              end-placeholder="结束"
              format="yyyy年MM月dd"
              value-format="timestamp"
              size="small">
            </el-date-picker>
          </div>
          <div class="block">
            <el-input v-model="searchForm.orderId" placeholder="订单号" size="small"></el-input>
          </div>
        </div>
        <!--第二行功能条-->
        <div style="margin-top: 10px">

          <div class="block" v-if="userType==1">
            <el-select v-model="searchForm.store" placeholder="门店" size="small" style="width: 200px">
              <el-option
                v-for="item in storeOption"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="block">
            <el-input v-model="searchForm.cashier" placeholder="收银员" size="small" style="width: 200px"></el-input>
          </div>
          <!--<div class="block">-->
            <!--<el-input v-model="searchForm.qrName" placeholder="二维码名称" size="small" style="width: 200px"></el-input>-->
          <!--</div>-->


          <div class="block">
            <el-button type="primary" size="small">查 询</el-button>
            <el-button size="small">重 置</el-button>
            <el-tooltip class="item" effect="dark" content="开发中" placement="right">
              <el-button size="small">导 出</el-button>
            </el-tooltip>
          </div>


          <!--<div class="block">-->
          <!--<el-select v-model="searchForm.payWay" placeholder="支付方式" size="small" style="width: 100px">-->
          <!--<el-option-->
          <!--v-for="item in payWayOption"-->
          <!--:key="item.value"-->
          <!--:label="item.name"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</div>-->

          <!--<div class="block">-->
          <!--<el-select v-model="searchForm.status" placeholder="订单状态" size="small" style="width: 100px">-->
          <!--<el-option-->
          <!--v-for="item in statusOption"-->
          <!--:key="item.value"-->
          <!--:label="item.name"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</div>-->


        </div>

        <div class="line-2_btn">
          <!--第二行-->

        </div>

      </div>
    </el-card>


    <!--表格-->
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
            prop="name"
            label="订单号"
            width="300">
          </el-table-column>
          <el-table-column
            prop="yxdd"
            label="门店">
          </el-table-column>
          <el-table-column
            prop="ddje"
            label="收银员">
          </el-table-column>
          <!--<el-table-column-->
            <!--prop="tkje"-->
            <!--label="二维码名称">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="gksf"
            label="商户实收">
          </el-table-column>
          <el-table-column
            prop="yh"
            label="退款金额">
          </el-table-column>
          <el-table-column
            prop="yh"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="yh"
            label="支付方式"
            :filters="payWayOption"
            :filter-method="payWayfilterTag"
          >
          </el-table-column>
          <el-table-column
            prop="yh"
            label="请选择状态"
            :filters="statusOption"
            :filter-method="statusfilterTag"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="small"> 详细信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>


  </div>
</template>

<script>
  export default {
    name: 'flowOrderList',
    data () {
      return {
        loading: false,
        searchDays: '0',//搜索天数
        userType: 1,
        searchForm: {
          orderId: '',
          cashier: '',
          qrName: '',
          store: '2',
          days: [],
          payWay: '',
          status: '',
        },//搜索条件
        storeOption: [
          {value: '0', name: '便利店0'},
          {value: '1', name: '便利店1'},
          {value: '2', name: '便利店2'},
          {value: '3', name: '便利店3'},
        ],
        payWayOption: [
          {value: 0, text: '微信'},
          {value: 1, text: '支付宝'},
          {value: 2, text: '银联卡'},
          {value: 3, text: '会员卡'},
        ],//支付方式选项
        statusOption: [
          {value: 0, text: '支付成功'},
          {value: 1, text: '冻结中'},
          {value: 2, text: '已退款'},
          {value: 3, text: '部分退款'},
          {value: 4, text: '退款中'},
          {value: 5, text: '退款失败'},
        ],//订单状态选项
        tableData: [
          {id: '1', name: '1', yxdd: '1', ddje: '1', tkje: '', gksf: '1', yh: 0},
          {id: '1', name: '1', yxdd: '1', ddje: '1', tkje: '', gksf: '1', yh: 1}
        ],//表格
      }
    },
    mounted () {
      //获取用户角色权限
      this.userType = sessionStorage.getItem('userType');

      //获取从流水概览中的门店ID

      //设定默认日期
      this.changeDays() //设置默认日期
    },
    //方法
    methods: {
      /**
       * 第一次默认查询
       */
      defaultSearch () {
        //设定7天日期//2
        this.changeDays(0)
      },

      /**
       *检查时间
       * 如果不对，则修改为里结束日期的前31天。
       */
      checkDataRange () {
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
        let event = this.searchDays;
        if (event == 0) {
          //当日
          this.$set(this.searchForm.days, 0, timestamp);
          this.$set(this.searchForm.days, 1, timestamp)
        } else if (event == 1) {
          let startTime = timestamp - (24 * 60 * 60 * 1000);
          let endTime = timestamp - (24 * 60 * 60 * 1000);
          this.$set(this.searchForm.days, 0, startTime);
          this.$set(this.searchForm.days, 1, endTime)
        } else if (event == 2) {
          let startTime = timestamp - (24 * 60 * 60 * 1000 * 6);
          let endTime = timestamp;
          this.$set(this.searchForm.days, 0, startTime);
          this.$set(this.searchForm.days, 1, endTime)
        }
      },
      // 支付方式筛选
      payWayfilterTag (value, row) {
        return row.yh === value
      },
      // 状态筛选
      statusfilterTag (value, row) {
        return row.yh === value
      },
    }
  }
</script>

<style scoped>
  .block {
    display: inline-block;
    vertical-align: middle;
    margin: 0 10px;
  }

  .box-card {
    margin: 0 0 10px 0;
  }

  .line-2_btn {
    margin-top: 5px;
  }

  .little_title {
    font-weight: bold;
    margin: 0 10px 0 0;
  }

  .little_title:after {
    content: ':';
  }

  .little_content {
    margin: 0 5px 0 0;
  }
</style>
